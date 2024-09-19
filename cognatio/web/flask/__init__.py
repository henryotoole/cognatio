"""Module that contains flask-related core functionality. Only import this if a flask server is being run.
"""
__author__ = "Josh Reed"

from cognatio.web.flask.app import db_flask, login_manager, dispatcher

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