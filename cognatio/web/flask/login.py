"""Setup methods for use in logging in and managing users.
"""
__author__ = "Josh Reed"

# Our code
from cognatio.web.flask.app import db_flask, login_manager
from cognatio.core.models import User

# Other libs

# Base python

@login_manager.user_loader
def load_user(user_id):
	"""Helper method to load the flask user within request contexts.

	Args:
		user_id (int): user ID provided by flask_login
	"""
	return db_flask.session.get(User, user_id)