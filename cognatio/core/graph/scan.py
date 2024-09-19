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
			fpath = page.fpath
			logger.info(f"> Scanning {page.name}...")

			# Parse each to links
			with open(fpath, 'r') as ffile:
				html = ffile.read()
			parser = CognatioParser()
			parser.feed(html)

			# Add each link to internal cache
			for link in parser.links:
				self._edge_merge(page, link)

			# Cache page weight at this stage too.
			page.mass_cached = self._mass_calc(html)
			mass_total += page.mass_cached
				
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