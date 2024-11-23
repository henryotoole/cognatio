"""
A set of flask routes that compose a REST API for a 'page resource'. A page resource is an informal file
in a folder relative to a page ID.
"""
__author__ = "Josh Reed"

# Our code
from cognatio import env
from cognatio.core.models import Page, User
from cognatio.web.schemas import api

# Other libs
from flask import current_app, request, jsonify
from flask_login import current_user

# Base python
import os
import hashlib
import io
import sys

class CreateException(ValueError):
	pass

url_rule = os.path.join(api.path_root_get() + "/page/<int:page_id>/resource/<string:fname>")
@current_app.route(url_rule, methods=["GET", "POST", "DELETE"])
def rest_api_page_resource_specific(page_id: int, fname: str):
	"""Implementation for the 'page resource' REST API. This API enables access to the 'page resource', a per-
	page folder containing all sorts of files. This function, specifically, converts the flask request context
	into arguments for context-free functions. Overall, this endpoint adheres to the general SchemaRFS setup:
	
	GET /api/v1/page/{id}/resource/<filename.ext>
	+ Returns all data (checksum and url)

	GET /api/v1/page/{id}/resource
	+ Returns a list of filenames

	POST /api/v1/page/{id}/resource/<filename.ext> Verify write access and create a file with this name / ext
	+ Request should be bundled into a multipart form. File should be named 'file'.
	+ Request form can include key 'write_offset' to specify a write offset.
	+ Returns all data (checksum and url)

	DELETE /api/v1/page/{id}/resource/<filename.ext> Verify write access and delete a file of this name / ext

	Static urls will be at /page/{page_name}_resources/filename.ext

	Args:
		page_id (int): The ID of the page
		fname (str): The full filename string, including extension e.g. "picture.png"
	"""
	page: Page = env.db.session.get(Page, page_id)

	user_id = None if not isinstance(current_user, User) else current_user.id

	if page is None: return "No such page", 404
	fpath = os.path.join(page.page_resource_folder_path, fname)

	if request.method == "GET":
		if not page.get_user_read_access(user_id): return f"No read access to page {page_id}", 403
		return jsonify({
			'id': fname,
			'url': _get_url(page, fname),
			'checksum': _get_checksum(page, fname),
			'size': os.path.getsize(fpath),
		})
	elif request.method == "POST":
		if not page.get_user_write_access(user_id): return f"No write access to page {page_id}", 403
		try:
			checksum = _create(
				page,
				fname,
				request.files['file'].stream,
				int(request.form.get('write_offset', 0))
			)
		except CreateException as e:
			return str(e), 400
		return jsonify({
			'id': fname,
			'url': _get_url(page, fname),
			'checksum': checksum,
			'size': os.path.getsize(fpath),
		})
	elif request.method == "DELETE":
		if not page.get_user_write_access(user_id): return f"No write access to page {page_id}", 403
		_delete(page, fname)
		return jsonify({})

url_rule = os.path.join(api.path_root_get() + "/page/<int:page_id>/resource")
@current_app.route(url_rule, methods=["GET"])
def rest_api_page_resource_general(page_id: int):
	"""The 'general' route for the page resource api. See rest_api_page_resource_specific() docstring.

	Args:
		page_id (int): The page ID involved.
	"""
	page: Page = env.db.session.get(Page, page_id)

	user_id = None if not isinstance(current_user, User) else current_user.id

	if page is None: return "No such page", 404
	if not page.get_user_read_access(user_id): return f"User does not have read access to page {page_id}", 403

	return jsonify(_get_all(page))
	
def _get_url(page: Page, fname: str) -> str:
	"""Get a page resource's URL by the page and filename. Authentication / validation is presumed to have
	already occurred.

	Args:
		page (Page): The page instance
		fname (str): The filename including extension

	Returns:
		str: Absolute URL with no domain
	"""
	return f"/page/{page.name}/resources/{fname}"

def _get_all(page: Page) -> 'list[str]':
	"""Get all resources filenames available for this Page.

	Args:
		page (Page): The page instance

	Returns:
		list[str]: A list of filenames with extensions included.
	"""
	return os.listdir(page.page_resource_folder_path)

def _create(page: Page, fname: str, chunk: io.BytesIO, write_offset=0) -> str:
	"""This is a multi-purpose create / upload function. The POST command can be taken to mean "Write this binary
	object to such-and-such place in the indicated file". If that file does not exist, it is created. If there's
	only one binary object, the location to write is the start. If a location is specified, it may be inferred
	that the file has been split into several, smaller payloads.

	Whatever the case, this function is agnostic to intent and will work the same way regardless.

	**Implementation Notes**
	It seems that the behavior of seeking past the end of a file can be different, on different filesystems.
	While this method does in fact allow for a write offset, it's probably best to force it to be called
	sequentially. This will perhaps make the code more OS agnostic. This has at least worked so far on Ubuntu.

	Args:
		page (Page): The page instance
		fname (str): The filename including extension
		chunk (io.BytesIO): The file object, taken from the request form
		write_offset (int): Byte offset for writing. Default 0.

	Returns:
		str: The checksum after writing the file.
	"""
	# If file does not exist, create a new blank one.
	fpath = os.path.join(page.page_resource_folder_path, fname)
	if not os.path.exists(fpath):
		with open(fpath, 'w') as f:
			pass
	
	# Open the file for appending binary data
	with open(fpath, 'r+b') as f:
		f.seek(write_offset)
		f.write(chunk.read())

	return _get_checksum(page, fname)

def _get_checksum(page: Page, fname: str) -> str:
	"""Get checksum for file.

	Args:
		page (Page): The page instance
		fname (str): The filename including extension

	Returns:
		str: The checksum after writing the file.
	"""

	fpath = os.path.join(page.page_resource_folder_path, fname)
	with open(fpath, 'rb') as ffile:
		server_checksum = hashlib.md5(ffile.read()).hexdigest()

	return server_checksum

def _delete(page: Page, fname: str) -> str:
	"""Delete a page resource by name.

	Args:
		page (Page): The page instance
		fname (str): The filename including extension
		fname (str): The filename including extension
	"""
	fpath = os.path.join(page.page_resource_folder_path, fname)
	os.remove(fpath)