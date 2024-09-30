"""
This holds the PageScanner class, which scans the entire page network to produce edges and page masses.
"""
__author__ = "Josh Reed"

# Our code
from cognatio import logger, env
from cognatio.core.models import Page, Edge
from cognatio.core.graph import CognatioParser, Link

# Other libs
from sqlalchemy import select
import hacutils

# Base python
import os
import time

class PageScanner:
	"""A scanner which will scan the configured 'pages' directory for all HTML and process the <a> and <link>
	tags within to form edges that connect the nodes of the graph. It also calculates the 'mass' of each page
	and caches that as well.

	**Todo**
	+ When 'external' pages are added, stop ignoring non-internal-page edges.
	"""

	def __init__(self, page_ids=None):
		"""Initialize a new scanner. Scan() will need to be called.

		Args:
			page_ids (list, optional): List of page id's to include in the scan. If None, all pages are scanned.
		"""
		self._scan_page_ids = page_ids
		self.reset()

	def scan(self):
		"""Run a scan operation. This will clear all cache variables and run a full scan.
		"""
		logger.info("Starting scan() operation.")
		t_start = time.time()
		self.reset()

		# Find all pages
		pages = self._get_pages_to_scan()
		mass_total = 0
		for page in pages:
			page: Page
			logger.info(f"> Scanning {page.name}...")

			# Parse each to links
			parser = self._parser_get(page.id)

			# Add each link to internal cache
			for link in parser.links:
				self._edge_merge(page, link)

			# Cache page weight at this stage too.
			page.mass_cached = self._mass_calc(parser.orig_html)
			mass_total += page.mass_cached

		# Check for stale edges for this page AFTER caching parsers but before adding new eges
		for page in pages:
			# Get all edges that originate from, or terminate on, this page.
			edges = Edge.get_edges_originating_from_page(page.id) + Edge.get_edges_terminating_on_page(page.id)
			for edge in edges:
				if not self._edge_should_exist(edge):
					env.db.session.delete(edge)
		env.db.session.commit()
				
		# Then iterate the resulting edge cache to add to db.
		for cstr, data in self._edge_cache.items():
			self._edge_add(data['page_orig_id'], data['page_term_name'], data['strength'])
		env.db.session.commit()

		t_elapsed = time.time() - t_start
		logger.info(f"Scanned {len(pages)} pages to produce {len(self._edge_cache)} edges in " +
			f" {round(t_elapsed, 2)}s.")
		logger.info(f"Total mass of scanned network is {mass_total} words.")

	def reset(self):
		"""Reset all cache variables.
		"""
		self._edge_cache = {}
		self._parser_cache = {}

	def _get_pages_to_scan(self) -> 'list[Page]':
		"""Get a list of page instances to scan in this run.

		Returns:
			list[Page]: List of pages instances.
		"""
		if self._scan_page_ids is None:
			
			page_rows = env.db.session.execute(select(Page)).all()
			return [p[0] for p in page_rows]
		
		pages = []
		for id in self._scan_page_ids:
			pages.append(env.db.session.get(Page, id))
		return pages
	
	def _parser_get(self, page_id: int) -> CognatioParser:
		"""A caching function for finished parsed HTML by page ID.

		The returned parser instance will have a reference to originating page name at
		parser.page_name

		Args:
			page_id (int): The page ID

		Returns:
			CognatioParser: A parser instance that's been run on this page's HTML already or None if
				no such page exists.
		"""
		if not page_id in self._parser_cache:
			page = env.db.session.get(Page, page_id)
			if page is None:
				self._parser_cache[page_id] = None
			else:
				# Parse each to links
				with open(page.fpath, 'r') as ffile:
					html = ffile.read()
				parser = CognatioParser()
				parser.feed(html)
				self._parser_cache[page_id] = parser

		return self._parser_cache[page_id]


	def _edge_merge(self, originating_page: Page, link: Link):
		"""Attempt to add an edge to the internal cache on the basis of a link object. Recall that the Link
		performs basic validation and parsing of the link but does NOT ensure that a page actually exists
		as specified.

		Currently, only 'internal' pages will result in the formation of an edge. Internal non-page nodes
		and external nodes are ignored for now.

		Args:
			link (Link): The link to convert to an edge.
		"""
		# Determine the endpoint of the link, and whether or not it's an internal page
		if link["page_name"] is None:
			return

		# Compute cache-string
		cstr = f"{originating_page.name}_{link['page_name']}"

		# Add to existing or create new edge in cache
		if cstr not in self._edge_cache:
			self._edge_cache[cstr] = {
				'page_orig_id': originating_page.id,
				'page_term_name': link["page_name"],
				'strength': 0
			}
		self._edge_cache[cstr]['strength'] += link['strength']

	def _edge_add(self, page_orig_id: int, page_term_name: str, strength: int):
		"""Add an edge with the above characteristics to the database. This will only result in a change
		if the terminating name actually refers to a real page. If an existing edge exists for the requested
		page ID's, its strength will be updated.

		Args:
			page_orig_id (int): The originating page ID
			page_term_name (str): The intended terminating page name
			strength (int): The strength of the bond
		"""
		page_term = Page.get_by_name(page_term_name)
		
		if page_term is None: return
		if page_term.id == page_orig_id: return

		edge_row = env.db.session.execute(
			select(Edge).filter_by(page_id_orig=page_orig_id, page_id_term=page_term.id)
		).first()

		if edge_row is None:
			edge = Edge(page_orig_id, page_term.id, strength)
			env.db.session.add(edge)
		else:
			edge_row[0].bond_strength_cached = strength

	def _edge_should_exist(self, edge: Edge) -> bool:
		"""Check that an existing edge (know because its record persists in the database) still has at least
		one record causing it to remain in existence.

		This method exists so that 'partial' rescans will successfully delete any edges that need pruning.

		NOTE: This method can probably be optimized. Adding a page-caching function to this class will
		speed this up.

		Args:
			edge (Edge): An edge to check for continued existence

		Returns:
			bool
		"""
		parser = self._parser_get(edge.page_id_orig)
		page_term = env.db.session.get(Page, edge.page_id_term)

		if page_term is None:
			raise ValueError("Not yet sure how to deal with deleted pages.")

		keep = False
		for link in parser.links:
			if(link['page_name'] == page_term.name):
				keep = True

		return keep

	def _mass_calc(self, html: str) -> int:
		"""Compute the 'mass' of an HTML document. This will return an integer. Mass aims to be a measure of
		the 'size' or 'weight' of a document. Lots of text, styling, etc. indicates that more effort and content
		is available in a document, and so this is what mass measures.

		**Implementation**
		Quite simply, checking the number of individual 'words' in a document is pretty good (assuming no
		minification). Every tag and attribute will be a word, as well as regular words within bodies of
		text. Notably, the mass of a document containing just the word 'Apple' 5 times will equal that of
		a page with 5 very long base64 encoded image strings.

		Args:
			html (str): A large string, composing an html document. 

		Returns:
			int: The mass of the page
		"""
		return len(html.split(' '))