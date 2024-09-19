"""The schema for a user
"""
__author__ = "Josh Reed"

# Our code
from cognatio.util.dr_hitch.schema_rsa import SchemaRSA
from cognatio import env
from cognatio.core.models import User

# Other libs
from marshmallow import fields, post_load
from flask import abort

# Base python

class UserSchema(SchemaRSA):

	__db_model__ = User
	__rest_path__ = "/user"
	__allowed_methods__ = ["GET"]

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