"""The schema for accessing an edge
"""
__author__ = "Josh Reed"

# Our code
from cognatio.core.models import Page, Friend
from cognatio.web.flask import rest_exposer
from cognatio import env

# Other libs
from marshmallow import fields, post_load
from restlink import SchemaDB, RESTException
from sqlalchemy import select

# Base python

class FriendSchema(SchemaDB):

	_db_model_ = Friend
	_rest_path_ = "/friend"
	_allowed_methods_ = ["GET", "POST", "DELETE"]

	# Everything is read only
	id = fields.Int(strict=True, dump_only=True)
	user_id = fields.Int()
	page_id = fields.Int()

	# Default permissions grant all read access, which is fine. Write is restricted to owner-user below.

	@post_load
	def make_friend(self, data: dict, **kwargs) -> Page:
		"""Make a new record tying a user to a page for shared mode.

		Args:
			data (dict): request data

		Returns:
			Page: New page, instantiated from data. Will include ID.
		"""
		user_id = data.get('user_id')
		page_id = data.get('page_id')

		exist = env.db.session.execute(
			select(Friend).filter_by(user_id=user_id, page_id=page_id)
		).first()
		if(exist is not None): raise RESTException(400, "Junction record already exists.")

		friend = Friend(user_id, page_id)
		env.db.session.add(friend)
		env.db.session.commit()
		return friend
	
	def validate_can_write(self, id) -> bool:
		"""Restrict write permissions to the owner-user.
		"""
		if rest_exposer.current_accessor is None: return False
		return rest_exposer.current_accessor.is_owner_user()