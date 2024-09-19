"""Routes that allow the navigator to perform its role
"""
__author__ = "Josh Reed"

# Our code
from cognatio import cognatio_config, project_path, env
from cognatio.core.models import Page, User
from cognatio.core.graph import scan_update_page
from cognatio.web.flask import dispatcher, RPCErrorCodes
from cognatio.web.schemas import api_route

# Other libs
from flask import current_app, send_from_directory, redirect, g, request
from flask_login import login_required, current_user
from dispatch_flask import dispatch_callable_function, DispatchResponseError

# Base python
import os
from pathlib import Path

@current_app.route('/nav')
def dev_nav_route():
	"""Serve the nav html page. Behavior differs depending on whether development mode is enabled.

	This route is only for development.
	"""

	if not cognatio_config['IS_DEV']:
		raise NotImplementedError("NGINX should override this in production")
	
	return redirect("/nav/src/navigator/nav.html")

@current_app.route("/nav/<path:path>")
def dev_nav_path(path):
	"""Expose source files for /nav so that the client may be used during development directly from
	source files.
	
	This route is only for development.

	Args:
		path (str): Supplied rest of path
	"""
	if not cognatio_config['IS_DEV']:
		raise NotImplementedError("NGINX should override this in production")
	
	navdir = os.path.join(project_path, "cognatio", "web", "client", "navigator")
	return send_from_directory(navdir, path)
	
@current_app.route("/page/<path:path>", methods=["GET"])
def dev_page(path):
	"""Expose the pages themselves. This is a development method that responds to GET requests for the
	html at various pages.
	
	This route is only for development.

	Args:
		path (str): Supplied rest of path. This should merely be an HTML file.
	"""
	if not cognatio_config['IS_DEV']:
		raise NotImplementedError("NGINX should override this in production")
	
	path_obj = Path(path)
	is_page = True

	# Here, a difference between /page/target.html and /page/target_resources/file.ext should be made.
	bits = str(path_obj).split("/")
	# If this is a complex path, verify it matches the required pattern and then find the page name.
	# It's a bit messy, unfortunately.
	if len(bits) > 1:
		if not '_resources' in bits[0]:
			return f"Path '{path}' is invalid.", 400
		page_name = bits[0][:-10] # Strip the _resources off the end
		path_obj = Path(page_name)
		is_page = False

	
	# Will launch a select * where query...
	page = Page.get_by_name(path_obj.stem)
	user_id = current_user.id if current_user.is_authenticated else None

	# This function is as optimal as possible in terms of resource usage.
	if page is None:
		return f"Page {path} does not exist.", 404
	elif page.get_user_read_access(user_id):
		if is_page and path_obj.suffix == "":
			path += ".html"
		return send_from_directory(env.fpath_pages, path), 200
	else:
		return "Unauthorized for read access", 403

@dispatch_callable_function(dispatcher)
#@login_required
def page_set_content(page_id: int, new_content: str):
	"""Set the content of a new page by ID. This method requires write access to the page instance in
	question on behalf of the logged-in user making this request. As permissions currently stand, only
	the owner-user has this right.

	Args:
		page_id (int): The ID of the page to change the content of
		new_content (str): The literal full text of the HTML to set for this page.
	"""
	page: Page = env.db.session.get(Page, page_id)

	if page is None:
		return DispatchResponseError(g.__dispatch__session_id, RPCErrorCodes.DOES_NOT_EXIST, f"Page {page_id} does not exist.")

	if not page.get_user_write_access(current_user.id):
		return DispatchResponseError(g.__dispatch__session_id, RPCErrorCodes.NO_ACCESS, "User has not write access.")

	page.set_page_content(new_content)
	# Udpate edges originating in this page and page mass.
	scan_update_page(page.id)