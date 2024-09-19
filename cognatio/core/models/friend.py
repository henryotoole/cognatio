"""
The Friends model
"""
__author__ = "Josh Reed"

# Our code
from cognatio.core.models import Base
from cognatio import env

# Other libs
from sqlalchemy.orm import Mapped, mapped_column

# Base python

class Friend(Base):
	"""A 'friend' is a user who can read an otherwise private page. The friend table depicts a many-to-many
	relationship: A page can have many friends and a friend can have many pages.

	Another way to think about this table is as the READ permissions for these files.

	There is no equivalent for WRITE. A cognatio network is a personal thing. It may be shared, holistically
	or partially, but ought to be the work of a single mind.
	"""

	__tablename__ = "friend"

	# A unique ID for all friends. This could be a composite of user_id and page_id, but a flat ID
	# makes it simpler to serve over a REST API
	id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
	# The user, who is a 'friend' to the page specified below
	user_id: Mapped[int] = mapped_column()
	page_id: Mapped[int] = mapped_column()

	def __init__(self, user_id, page_id):
		"""Create a new 'friend' for the provided page_id in the form of the provided user.

		Args:
			user_id (int): The user's ID
			page_id (int): The page's ID
		"""
		self.user_id = user_id
		self.page_id = page_id