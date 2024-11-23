"""
Bind methods for restlink.

2024
"""
__author__ = "Josh Reed"

# Local code
from cognatio.web.flask.app import rest_exposer
from cognatio import env

# Other libs
from flask_login import current_user

# Base python



@rest_exposer.authenticator
def restlink_auth():
	"""Performs authentication for restlink.
	"""
	# Only returns the current_user object if not anonymous.
	if current_user is None: return None
	if current_user.is_anonymous: return None
	return current_user

@rest_exposer.database_session_getter
def restlink_db():
	"""Gets a Session instance for restlink.
	"""
	return env.db.session