"""
The 'graph' submodule of core contains functionality that performs primitive graph theory. This might involve
simpler things like HTML parsing up to more complex operations like n-dim planar projection.
"""
__author__ = "Josh Reed"

# Exports
from cognatio.core.graph.cparser import CognatioParser, Link
from cognatio.core.graph.scan import PageScanner

def scan_update_page(page_id):
	"""Run the scanner on a singular page. This will update all edges and page mass for just this page alone,
	but will not rescan the entire network. Such an operation should always be fast enough to run within
	a request context.

	Args:
		page_id (int): The page to re-scan
	"""
	scanner = PageScanner([page_id])
	scanner.scan()