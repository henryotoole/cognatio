"""Routes to handle login / logout operations.
"""
__author__ = "Josh Reed"

# Our code
from cognatio import cognatio_config, env
from cognatio.core.models import Page, User
from cognatio.web.flask import login_manager, dispatcher

# Other libs
from flask import current_app, g
from flask_login import login_user, logout_user, current_user
from sqlalchemy import select
from dispatch_flask import dispatch_callable_function, DispatchResponseError

# Base python

@current_app.route('/logout', methods=['GET', 'POST'])
def logout():
	if current_user is None: return "Logged out as user", 200
	if current_user.is_anonymous: return "Logged out as user", 200
	
	logout_user()

	return "Logged out as user", 200

@dispatch_callable_function(dispatcher)
def get_logged_in_user_id():
	"""Get the ID of the logged-in user (via flask_login). This does NOT belong in the user schema because
	being 'logged in' is not really a property of a user.

	Returns:
		dict: {id: int} The user ID or none if not logged in.
	"""
	if current_user is None: return {'id': None}
	if current_user.is_anonymous: return {'id': None}
	return {'id': current_user.id}
	return "Logged out as user", 200

@dispatch_callable_function(dispatcher)
def login(email, password, stay_logged_in):
	"""Attempt to log in with provided credentials.

	Args:
		email (str): The provided email.
		password (str): The provided password.
		stay_logged_in (bool): Whether to stay logged in.

	Raises:
		DispatchResponseError if the user is unknown or password is bad.

	Returns:
		int: The resulting ID.
	"""
	user = env.db.session.execute(select(User).filter_by(email=email)).scalar()
	if user is None:
		return DispatchResponseError(g.__dispatch__session_id, 404, f"User for {email} does not exist.")
	if not user.pw_validate(password):
		return DispatchResponseError(g.__dispatch__session_id, 404, f"Bad password.")
	login_user(user, remember=stay_logged_in)
	return user.id

@dispatch_callable_function(dispatcher)
def account_create(email, password):
	"""Try to create a new account with provided credentials. Will not log the user in.

	Args:
		email (str): The provided email.
		password (str): The provided password.

	Raises:
		DispatchResponseError with code 700 if a user already exists.

	Returns:
		int: The resulting ID.
	"""
	user = env.db.session.execute(select(User).filter_by(email=email)).scalar()
	if user is not None:
		return DispatchResponseError(g.__dispatch__session_id, 700, f"User for {email} already exists!")
	if len(password) < 12:
		return DispatchResponseError(g.__dispatch__session_id, 404, f"Password does not meet criteria.")
	
	user = User(email, password)
	env.db.session.add(user)
	env.db.session.commit()
	return user.id