"""Module that contains flask-related core functionality. Only import this if a flask server is being run.
"""
__author__ = "Josh Reed"

from cognatio.web.flask.app import db_flask, login_manager, dispatcher
from flask.wrappers import Response
from flask import render_template_string

# Other libs
from flask import current_app

# Base python
from enum import Enum

class RPCErrorCodes(int, Enum):

	NO_ACCESS = 403
	"""Returned when a user has not got access to something requested."""
	DOES_NOT_EXIST = 404
	"""Returned when a requested resource does not exist."""
	DATA_MISSING = 700
	"""Returned when request cannot be completed because data is missing."""
	INVALID_PARAMS = 701
	"""Returned when a parameter is invalid"""
	RESOURCE_LOCKED = 423
	"""Returned when a resource cannot be accessed because another thread has it"""

def render_template(fpath, **kwargs) -> Response:
	"""Render a flask template with an absolute path rather than a name within a pre-defined templates
	folder.

	I have suspicions that flask's templating engine using caching or something for speed, but I'm not worried
	about it for this application (which by and large does not rely on templating).

	Args:
		fpath (str): Absolute path to file

	Returns:
		Response: Flask response
	"""
	with open(fpath, 'r') as ffile:
		text = ffile.read()
	return render_template_string(text, **kwargs)