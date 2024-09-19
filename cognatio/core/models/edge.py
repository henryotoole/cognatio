"""
The Edge model, which represents connections between pages.
"""
__author__ = "Josh Reed"

# Our code
from cognatio.core.models import Base, Page
from cognatio import env

# Other libs
from sqlalchemy.orm import Mapped, mapped_column

# Base python

class Edge(Base):
	"""An 'edge' is a connection between two pages. Mostly this will take the form of an anchor reference in an
	<a> tag or, more rarely, in the form of a true <link>.

	**Lifecycle**
	An edge is formed when a page scan action determines a link of some sort between two pages. At this point
	an ID is assigned and the original strength is calculated. Successive scans may find that the strength
	has changed as more links are added between two pages. Strength will be updated, but ID will not change.
	If all links between two pages are removed, the record for that edge will be removed next scan.

	If either end of the edge is deleted, the edge will NOT be deleted. Edges can ONLY be deleted if both ends
	are destroyed. So some edges will only have one 'live' end and will reference a lost page. This is
	intentional and leaves room for some interesting work in the future.

	**Musings**

	https://www.w3.org/TR/html401/struct/links.html

	Reading through the original w3 docs for links, it seems the original concept for HTML was "a book, but more
	so". The <head> tag could contain proper <links> with rel and rev to indicate how to traverse back and
	forwards. The book is a tape, and a series of related HTML pages should also follow a tape.

	But at the same time they realized the power of non-linear networks: "Although a simple concept, the link has
	been one of the primary forces driving the success of the Web". The link is a fundamental rule of the
	universe, like atomic forces. However, the emergent properties of the internet are far more complex.
	Cognatio is not a tape. It's a network.
	"""

	__tablename__ = "edge"

	id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
	"""A unique ID for all edges.
	"""
	page_id_orig: Mapped[int] = mapped_column(nullable=False)
	"""The originating of the two pages that this edge connects. Links are directional, so the 'original and
	'terminal' pages are both defined as such.
	"""
	page_id_term: Mapped[int] = mapped_column(nullable=False)
	"""The terminating of the two pages that this edge connects. Links are directional, so the 'original and
	'terminal' pages are both defined as such.
	"""
	bond_strength_cached: Mapped[int] = mapped_column(nullable=False)
	"""The 'bond strength' of an edge is the sum of all individual link strengths. This field is a cache, and is
	interpreted from the HTML itself when the network is scanned.
	"""

	def __init__(self, page_id_orig, page_id_term, bond_strength=1):
		"""Create a new 'friend' for the provided page_id in the form of the provided user.

		Args:
			page_id_orig (int): The originating page's ID
			page_id_term (int): The terminal page's ID
			bond_strength (int, optional): The total strength of the bond along this edge. Default 1.
		"""
		if page_id_orig == page_id_term: raise ValueError("Link can not be self-referential.")
		self.page_id_orig = page_id_orig
		self.page_id_term = page_id_term
		self.bond_strength_cached = bond_strength

	def get_page_orig(self) -> Page:
		"""Lookup in db and return the instance of the originating page of this edge. If that page has been
		deleted, then this will return None.

		Returns:
			Page: The originating page or None.
		"""
		return env.db.session.get(Page, self.page_id_orig)
	
	def get_page_term(self) -> Page:
		"""Lookup in db and return the instance of the terminating page of this edge. If that page has been
		deleted, then this will return None.

		Returns:
			Page: The terminating page or None.
		"""
		return env.db.session.get(Page, self.page_id_term)
	
	def __repr__(self): return self.__str__()

	def __str__(self): return f"<Edge {self.id} connecting {self.page_id_orig}->{self.page_id_term}>"