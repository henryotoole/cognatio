"""The schema for a user
"""
__author__ = "Josh Reed"

# Our code
from cognatio import env
from cognatio.core.models import User

# Other libs
from marshmallow import fields, post_load
from flask import abort
from restlink import SchemaDB
from sqlalchemy import select

# Base python

class UserSchema(SchemaDB):

	_db_model_ = User
	_rest_path_ = "/user"
	_allowed_methods_ = ["GET"]

	id = fields.Int(strict=True, dump_only=True)
	email = fields.Email()
	passhash = fields.String(dump_only=True)
	# The password is a temporary variable only used during create
	password = fields.String(load_only=True)

	@post_load
	def make_user(self, data: dict, **kwargs) -> User:
		"""Make a new user with json data which will be validated. This will create a new database record.

		Args:
			data (dict): request data. Should contain email and password.

		Returns:
			User: New user, instantiated from data. Will include ID.
		""" 
		rec = User(data['email'], data['password'])
		env.db.session.add(rec)
		env.db.session.flush()
		return rec
	
	def _list(self, search=None, **kwargs):
		"""Actually perform get list operation post-validation.

		Args:
			search (str, optional): Key/value data which is used to filter the returned ID.

		Returns:
			list: Of integer ID's.
		"""
		# Perform usual operation
		ids = super()._list(**kwargs)
		matching = []

		# Find all user ID's that match search
		for row in env.db.session.execute(
			select(User.id).where(User.email.like(f"%{search}%"))
		).all():
			user_id = row[0]
			if user_id in ids: matching.append(user_id)

		# Return the union of the two.
		return matching
		
	
# Add custom params to map.
UserSchema._method_map_["GET"]["general"]["params"]["search"] = {
	'required': False,
	'description': "URL-encoded string which searches for a user on the basis of email.",
}