"""Misc routes that allow cognatio to work.
"""
__author__ = "Josh Reed"

# Our code
from cognatio.core.models import Page
from cognatio.core.enums import PageAccessMode
from cognatio.util.paths import get_page_name_from_url
from cognatio import cognatio_config

# Other libs
from flask import current_app, request
from flask_login import current_user

# Base python
import urllib
import os

@current_app.route("/auth/page", methods=["GET", "POST"])
def page_auth():
	"""Determine whether or not the logged-in user has access to a page.
	"""
	# This will be the original requested route, something like:
	# '/page/target.html' or
	# '/page/target' or
	# '/page/target/resource/some_file.txt'
	return _page_auth(request.headers['X-Original-Uri'])

def _page_auth(url):
	"""Actually perform the auth against a url. Broken for testing and internal use.

	Args:
		url (str): URL from the request to authorize

	Returns:
		tuple: flask-style response tuple.
	"""

	# Determine target page by analyzing URL.
	pagename = get_page_name_from_url(url)

	# Will launch a select * where query...
	page = Page.get_by_name(pagename)
	user_id = current_user.id if current_user.is_authenticated else None

	# This function is as optimal as possible in terms of resource usage.
	if page is None:
		return "No such page.", 404
	elif page.get_user_read_access(user_id):
		return "", 200
	else:
		if not current_user.is_authenticated:
			return "Not logged in", 401
		else:
			return "Not authorized for page", 403