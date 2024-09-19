"""Misc routes that allow cognatio to work.
"""
__author__ = "Josh Reed"

# Our code
from cognatio.core.models import Page
from cognatio.core.enums import PageAccessMode
from cognatio import cognatio_config

# Other libs
from flask import current_app, request
from flask_login import current_user

# Base python
import urllib
import os

@current_app.route("/page_auth", methods=["GET", "POST"])
def page_auth():
	"""Determine whether or not the logged-in user has access to a page.
	"""
	# This will be the original requested route, something like '/static/private/../../...'
	static_request_uri = request.headers['X-Original-Uri']

	# Pull the filename out of the request
	static_request_parsed = urllib.parse.urlparse(static_request_uri)
	requested_filename = os.path.basename(static_request_parsed.path)

	# Will launch a select * where query...
	page = Page.get_by_name(requested_filename)
	user_id = current_user.id if current_user.is_authenticated else None

	# This function is as optimal as possible in terms of resource usage.
	if page is None:
		return "", 404
	elif page.get_user_read_access(user_id):
		return "", 200
	else:
		return "", 403