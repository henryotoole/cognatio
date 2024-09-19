"""
Contains a class that connects the basic REST Schema to an filesystem on-disk.

MOTHBALLED Aug 30, 2024. See **Todo** in docstring.
"""
__author__ = "Josh Reed"

# Our code
from cognatio.util.dr_hitch import SchemaREST

# Other libs

# Base python

class SchemaRFS(SchemaREST):
	"""SchemaRFS stands for Schema REST File System. It provides implementations for the `_action()` functions
	that connect this schema to an a folder in a filesystem. It's purpose is to provide a simple way to upload
	and keep track of files on a webserver.
	+ get()			- Get the statically-accessible URL for this resource. It does not get the file itself.
	+ post()		- Create a new edition of this resource using multipart form data.
	+ delete()		- Delete a file.
	+ get_bulk()	- Implemented in SchemaREST, but functional here.

	The following restrictions apply:
	1. These files have no metadata that can be permanently saved. If metadata is needed (e.g. filename, ownership,
	etc.) a separate **record** resource will need to be created. If the ID's of *that* resource correspond
	to the ID's of this filesystem resource (e.g. filename) then the two can work together.
	2. All files for this schema must be placed in the same directory, as specified in __files_dir__
	3. Only one file extension per name is allowed.

	**On ID and Naming**
	It is desirable from a simplicity standpoint to have a flat directory with file objects with no extensions.
	That way the name of the file is simply the ID. However, files need extensions to be properly used in the
	frontend. Therefore, a system is needed where a file can be referenced by ID to get name.ext and vice
	versa. This is achieved efficiently by employing memcaching.

	**On Usage**
	This class aims to be a sort of fundamental building block. On it's very own, it's not terribly useful.
	To do interesting things (such as have filenames or permissions) an RFS schema should pair with a more
	traditional one (such as RSA) that points at a database record. Record ID=4 will, implicitly, map to
	file name=4, with whatever extension. Any record from a table that *can* have a file must merely have
	a SchemaRFS associated with the SchemaRSA and have the full advantage of file storage, static access,
	permissions, and uploads taken care of. And all that without any extra code in SchemaRSA or descendents!

	Even the strange restrictions of a flat directory are easy to get around. Perhaps an image is uploaded
	and a thumbnail should be generated... just have two FS schema's - one for the image and the other for
	the thumbnail.

	**On Permissions**
	Don't forget that permissions will still need to be implemented in some child of this class (unless they
	are public read only). See SchemaREST's docstring for details. This class goes a further step in that
	the validate_can_read() method **should also** be used to validate static requests for a file. For example,
	if NGINX is involved, a request through NGINX for a permissions-locked static file should have `auth_request`
	check the get() method for this ID.

	**Todo**
	Alright, this is a note from Aug 30, 2024. I've realized that, as beautiful as this will be, it does not
	serve the very specific purpose I was developing it for right now. I need a fluid way to access and handle
	resources for pages. However, it's overwhelmingly convenient to directly expose a single folder per-page
	with files of various names and extensions. This enables the best-possible workflow both in the nav
	AND when I'm working SSH'd into the backend directly. Cognatio is a strange project in many ways and levies
	demands that most projects would not.

	However, I am still convinced that this is THE way to deal with files. I've left my master diagram in the
	dr_hitch folder as well, in case I can not return to finish this class by the end of the Cognatio project.

	I very much shall return to finish this, the moment a real need presents itself for this code.
	"""

	__files_dir__ = None
	"""An absolute path to somewhere on the filesystem where files can be written and read."""
	__implemented_methods__ = ["GET", "POST", "DELETE"]
	"""A list of HTTP methods that this schema actually has implementations for. Used by SchemaRSA, RFS, etc."""
	__expose_static_route__ = False
	"""Whether or not to expose this directory statically via flask. """

	def upload_write(self):
		"""TODO, this will write a multipart file chunk. Can be used to write all in one go if inputs are right.
		"""
		pass

	def _file_path(self, id) -> str:
		"""Get absolute filesystem path of this file. Will include extension.

		Args:
			id (*): The ID of the file.

		Returns:
			str: Absolute filesystem path.
		"""
		pass

	def _file_id_to_ext(self, id) -> str:
		"""Determine the file extension from an ID. Filenames are of the form id.ext. This uses redis for
		caching to reduce disk-lookup operations.

		Args:
			id (*): The ID of the file.

		Returns:
			str: Extension as a string
		"""
		# Check cache, if miss use lookup, then store.
		pass

	def _file_ext_lookup(self, id) -> str:
		"""Actually look into the file directory to determine the extension of the single file that has name
		equal to provided ID.

		Args:
			id (*): The ID of the file.

		Returns:
			str: Extension as a string
		"""
		pass

	def _get(self, id: int) -> dict:
		"""Get the statically-available URL for this file. This URL should route through some externally
		implemented mechanism (e.g. NGinX, or less optimally a flask route) that exposes these files.

		WARNING! This external implementation **should check permissions** by querying this very GET path.
		This GET method will return a 403 if the accessor does not have valid access to this file.

		TODO: What should the default URL be? It COULD be /api/v2/noun/id.ext (instead of /api/v2/noun/id).
		But is that right?

		Args:
			id (int): An integer ID

		Returns:
			dict: 'serialized' data of this Schema
		"""
		pass
	
	def _create(self, data: dict) -> dict:
		"""Implements the actual action of performing create().

		TODO: this will perform the file-write operation.

		Args:
			data (dict): The data that came along with the request

		Returns:
			dict: 'serialized' data of the new record
		"""
		pass
	
	def _delete(self, id: int):
		"""Implements the actual action of performing delete().

		TODO

		Args:
			id (int): An integer ID of the record to delete
		"""
		pass