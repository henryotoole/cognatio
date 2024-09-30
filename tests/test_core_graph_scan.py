"""
Tests for the graph scanner
"""
__author__ = "Josh Reed"

# Our code
from cognatio.core.graph import PageScanner
from cognatio.core.models import Edge, Page
from cognatio.core.enums import PageAccessMode
from cognatio.util.db import Database

# Other libs
from sqlalchemy import select

# Base python

# And check resulting edges.
def get_edge(test_db, id1, id2) -> Edge:
	edge_row = test_db.session.execute(
		select(Edge).filter_by(page_id_orig=id1, page_id_term=id2)
	).first()
	if edge_row is None: return None
	return edge_row[0]

def test_scan_op(test_db: Database):
	"""Test scan op. Ensure that
	+ All links are found
	+ External are ignored
	+ Overlapping are merged
	+ Existing Edge record ID's are preserved
	"""
	# Setup three pages and one existing edge
	p1 = Page(PageAccessMode.PRIVATE, "p1")
	p2 = Page(PageAccessMode.PRIVATE, "p2")
	p3 = Page(PageAccessMode.PRIVATE, "p3")

	test_db.session.add(p1)
	test_db.session.add(p2)
	test_db.session.add(p3)
	test_db.session.commit()

	edge_exist = Edge(p1.id, p2.id, 999)

	test_db.session.add(edge_exist)
	test_db.session.commit()

	# Set some page html. Parsing is already tested so this just needs to be a list of <a> records
	p1_html = '''
	<a href="/page/p1"> References to self are ignored </a>
	<a href="/page/p2"> Good reference </a>
	<a href="/page/p2"> Good reference </a>
	<a href="/page/p3" strength=100> Good reference </a>
	'''
	p2_html = '''
	<a href="/page/p1"> Good reference </a>
	<a href="/page/p3"> Good reference </a>
	<a href="/page/p4"> Page does not exist </a>
	<a href="/etc"> Internal non-page </a>
	'''
	p3_html = '''
	<a href="www.example.com/page/p1"> External ref </a>
	'''
	for page, html in [[p1, p1_html], [p2, p2_html], [p3, p3_html]]:
		with open(page.fpath, 'w') as ffile:
			ffile.write(html)

	# Ok, now run the scan
	scanner = PageScanner()
	scanner.scan()
	
	#for edge in test_db.session.execute(select(Edge)).all():
	#	e: Edge = edge[0]
	#	print(e)

	
	assert get_edge(test_db, p1.id, p2.id).bond_strength_cached == 2
	assert get_edge(test_db, p1.id, p2.id).id == edge_exist.id # ID's are preserved.
	assert get_edge(test_db, p1.id, p3.id).bond_strength_cached == 5 # 100 will be max'd at 5
	assert get_edge(test_db, p2.id, p1.id).bond_strength_cached == 1
	assert get_edge(test_db, p2.id, p3.id).bond_strength_cached == 1

	assert len(test_db.session.execute(select(Edge)).all()) == 4

	# Check that at least one mass was computed
	assert p2.mass_cached == 19
	assert p3.mass_cached == 5

def test_partial_scan_find(test_db: Database):

	# Setup a system with three pages. P1 links to P2, and P2 links to P3
	p1 = Page(PageAccessMode.PRIVATE, "p1")
	p2 = Page(PageAccessMode.PRIVATE, "p2")
	p3 = Page(PageAccessMode.PRIVATE, "p3")

	test_db.session.add(p1)
	test_db.session.add(p2)
	test_db.session.add(p3)
	test_db.session.commit()

	p1_html = '''
	<a href="/page/p2"> Good reference </a>
	'''
	p2_html = '''`
	'''
	p3_html = '''
	<a href="/page/p2"> Good reference </a>
	'''
	for page, html in [[p1, p1_html], [p2, p2_html], [p3, p3_html]]:
		with open(page.fpath, 'w') as ffile:
			ffile.write(html)

	# Test the partial scan to begin with
	scanner = PageScanner([p1.id])
	scanner.scan()

	edge = get_edge(test_db, p1.id, p2.id)
	assert edge is not None
	assert len(test_db.session.execute(select(Edge)).all()) == 1
	
	# Test that the found link will be deleted if it's removed from page 1 and then p2 is scanned.
	with open(p1.fpath, 'w') as ffile:
		ffile.write("")

	# Re-scan on p2
	scanner = PageScanner([p2.id])
	
	# Intermediate check
	assert scanner._edge_should_exist(edge) is False

	scanner.scan()

	assert len(test_db.session.execute(select(Edge)).all()) == 0