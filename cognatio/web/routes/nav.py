"""Routes that allow the navigator to perform its role
"""
__author__ = "Josh Reed"

# Our code
from cognatio import cognatio_config, project_path, env, version
from cognatio.core.models import Page, User
from cognatio.core.enums import PageAccessMode
from cognatio.core.graph import scan_update_page
from cognatio.web.flask import dispatcher, RPCErrorCodes, render_template
from cognatio.web.routes.misc import _page_auth
from cognatio.util.paths import get_page_name_from_url

# Other libs
from flask import current_app, send_from_directory, redirect, g, send_file
from flask_login import login_required, current_user
from dispatch_flask import dispatch_callable_function, DispatchResponseError

# Base python
import os
from pathlib import Path

GATEWAY_NAME = cognatio_config["GATEWAY_PAGE_NAME"]

@current_app.route("/")
def nav_base_redirect():
	"""This catches base url queries and shunts them towards the 'gateway' page.
	"""
	return redirect(f"/page/{GATEWAY_NAME}.html")

@current_app.route("/favicon.ico")
def nav_favicon_redirect():
	"""This catches base url queries and shunts them towards the 'gateway' page.
	"""
	return redirect(f"/s/nav/assets/icons/cognatio64.png")

@current_app.route(f"/page/{GATEWAY_NAME}.html")
def nav_gateway():
	"""This is a special override that will serve the gateway manually and ensure that a gateway exists, if
	one does not.
	"""
	page_gateway = Page.get_by_name(GATEWAY_NAME)

	if page_gateway is None:
		page_gateway = Page(PageAccessMode.PUBLIC, name=GATEWAY_NAME)
		env.db.session.add(page_gateway)
		env.db.session.commit()
		with open(os.path.join(env.fpath_static, 'html', 'stubs', 'gateway_default.html'), 'r') as ffile:
			html_str = ffile.read()
		page_gateway.set_page_content(html_str)

	return send_from_directory(env.fpath_pages, f"{GATEWAY_NAME}.html")

@current_app.route('/nav')
def nav_route():
	"""Directly serve the nav html to load the nav app.
	"""
	# For dev and production, this file does not change location (e.g. it is not bundled or compiled)
	return render_template(
		os.path.join(project_path, "cognatio", "web", "client", "navigator", "src", "nav.html"),
		cognatio_config=cognatio_config,
		cognatio_version=version
	)

@current_app.route('/login')
def nav_route_login():
	"""Directly serve the login html to load the nav app.
	"""
	# For dev and production, this file does not change location (e.g. it is not bundled or compiled)
	return render_template(
		os.path.join(project_path, "cognatio", "web", "client", "navigator", "src", "login.html"),
		cognatio_config=cognatio_config,
		cognatio_version=version
	)

@current_app.route("/nav/<path:path>")
def dev_nav_dir(path):
	"""Expose source files for /nav so that the client may be used during development directly from
	source files.
	
	This route is only for development.

	In production /nav/* should redirect to /s/nav/*

	Args:
		path (str): Supplied rest of path
	"""
	if not cognatio_config['IS_DEV']:
		return "Source can not be requested if server is not in dev mode", 500
	
	navdir = os.path.join(project_path, "cognatio", "web", "client", "navigator")
	return send_from_directory(navdir, path)

@current_app.route("/s/<path:path>")
def dev_static(path):
	"""Expose source files for /s so that the client may be used during development under flask.
	
	This route is only for development.

	Args:
		path (str): Supplied rest of path
	"""
	if not cognatio_config['IS_DEV']:
		return "Static can not be requested via flask if server is not in dev mode", 500
	
	return send_from_directory(env.fpath_static, path)

@current_app.route("/sl/<path:path>")
def dev_static_local(path):
	"""Expose source files for /sl so that the client may be used during development under flask.
	
	This route is only for development.

	Args:
		path (str): Supplied rest of path
	"""
	if not cognatio_config['IS_DEV']:
		return "Static can not be requested via flask if server is not in dev mode", 500

	return send_from_directory(env.fpath_static_local, path)
	
@current_app.route("/page/<path:path>", methods=["GET"])
def dev_page(path):
	"""Expose the pages themselves. This is a development method that responds to GET requests for the
	html at various pages.
	
	This route is only for development.

	Args:
		path (str): Supplied rest of path. This should merely be an HTML file.
	"""
	if not cognatio_config['IS_DEV']:
		return render_template(
			os.path.join(env.fpath_static, 'html', 'utility', 'misconfigured_nginx.html'),
			message="Reverse proxy is not serving the local 'pages' directory."
		)
	
	# We want to use the real method as much as possible so bugs can be caught in development.
	url = os.path.join('/page', path)
	msg, code = _page_auth(url)

	if(code != 200):
		# Mirror (some of) the Nginx pages' behaviors
		if(code == 401 or code==403):
			# NGINX won't redirect, it just serves the error HTML under the original URL.
			return send_file(os.path.join(env.fpath_static, 'html', 'utility', f'error_{code}.html'))
		else:
			return msg, code

	# Add .html for pages
	if len(url.split("/")) == 3 and (not '.html' in url):
		path += ".html"

	return send_from_directory(env.fpath_pages, path), 200

@dispatch_callable_function(dispatcher)
def page_set_content(page_id: int, new_content: str):
	"""Set the content of a new page by ID. This method requires write access to the page instance in
	question on behalf of the logged-in user making this request. As permissions currently stand, only
	the owner-user has this right.

	Args:
		page_id (int): The ID of the page to change the content of
		new_content (str): The literal full text of the HTML to set for this page.
	"""
	page: Page = env.db.session.get(Page, page_id)
	user_id = current_user.id if current_user.is_authenticated else None

	if page is None:
		return DispatchResponseError(g.__dispatch__session_id, RPCErrorCodes.DOES_NOT_EXIST, f"Page {page_id} does not exist.")

	if not page.get_user_write_access(user_id):
		return DispatchResponseError(g.__dispatch__session_id, RPCErrorCodes.NO_ACCESS, "User has not write access.")

	page.set_page_content(new_content)
	# Update edges originating in this page and page mass.
	scan_update_page(page.id)

@dispatch_callable_function(dispatcher)
def page_get_presets():
	"""Get a list of available preset URLs (relative to root). This scans the preset directory, which is
	essentially hard-coded within the body of this function. It's a sort of magic directory, I suppose.

	It also includes the 'stubs' folder, in the regular static directory.

	Returns:
		dict: Of names to relative URL's
	"""
	out = {}
	fpath_stubs = os.path.join(env.fpath_static, 'html', 'stubs')
	for fname in os.listdir(fpath_stubs):
		if '.html' in fname:
			out[fname.split('.')[0]] = os.path.join("/s", "html", "stubs", fname)

	fpath_preset_dir = os.path.join(env.fpath_static_local, 'presets')

	if os.path.exists(fpath_preset_dir):
		for fname in os.listdir(fpath_preset_dir):
			if '.html' in fname:
				out[fname.split('.')[0]] = os.path.join("/sl", "presets", fname)

	return out

@dispatch_callable_function(dispatcher)
def update_scan_for_page(page_id: int):
	"""Manually call the scan update function for a page.

	Args:
		page_id (int): The ID of the page to update scan for
	"""
	# Update edges originating in this page and page mass.
	scan_update_page(page_id)