"""Schema for Page model.
"""
__author__ = "Josh Reed"

# Our code
from cognatio import env, cognatio_config
from cognatio.core.models import Page
from cognatio.core.enums import PageAccessMode
from cognatio.web.flask.app import rest_exposer

# Other libs
from marshmallow import fields, post_load, validate
from flask import abort
from sqlalchemy import select
from restlink import SchemaDB

# Base python

class PageSchema(SchemaDB):

	_db_model_ = Page
	_rest_path_ = "/page"
	_allowed_methods_ = ["GET", "POST", "PUT"]
	_field_db_remap_ = {"name": "name_rec"}

	id = fields.Int(strict=True, dump_only=True)
	read_access_int = fields.Int(validate=validate.OneOf([e.value for e in PageAccessMode]))
	# Note that 'name' here actually points to a getter in the model.
	name = fields.String(validate=validate.Length(min=1, max=64))
	mass_cached = fields.Int(dump_only=True)

	@post_load
	def make_page(self, data: dict, **kwargs) -> Page:
		"""Make a new page with json data which will be validated. This will create a new database record.

		Args:
			data (dict): request data

		Returns:
			Page: New page, instantiated from data. Will include ID.
		"""
		read_access_int = data.get('read_access_int')
		name = data.get('name')
		# Must manually check here that name, if provided, is available.
		if name:
			if env.db.session.execute(select(Page).filter_by(name=name)).first() is not None:
				abort(400, f"Page name {name} already exists and must be unique.") 
		page = Page(PageAccessMode(read_access_int), name=name)
		env.db.session.add(page)
		env.db.session.commit()
		return page
	
	def _update(self, id, data: dict) -> dict:
		"""Update method for a page. This can, currently, only change the page name.

		Args:
			id (int): The ID of the page to update
			data (dict): All data that we wish to update.

		Returns:
			dict: New page record after updates
		"""
		self.validate(data)
		page = env.db.session.get(Page, id)
		if not page: 
			abort(404, f"Page {id} does not exist.")
		
		# Apply name if availale.
		name = data.get('name')
		if name:
			abort(403, "Can not change name at this time.")
			exist = env.db.session.execute(select(Page).filter_by(name=name)).first()
			if exist and exist.id != id:
				abort(400, f"Name {name} already exists for Page {exist.id}")
			page.name = name

		# Default behavior for remaining keys.
		return super().update(id, data)
	
	def _delete(self, id):
		"""Delete a Page record. This will also delete the page file from filesystem...

		TODO:
		Questions to answer:
		1. Should this even be allowed? Perhaps a better delete replaces the node's file with a REDACTED
		   page or something, so that old links to this page still work...
		2. Maybe, alternately, we can use the same mass-link-altering functionality needed for renaming
		   to cause all links to this page to be removed???

		Args:
			id (int): ID of Page to delete
		"""
		raise NotImplementedError("See comment block.")
	
	def validate_can_read(self, id) -> bool:
		# All read access to page **record** data is allowed. The same is true of edges, so in other words
		# all access is allowed to the map of the network itself. Actual content for pages is handled thru
		# a GET request against the file itself, and access will be blocked accordingly in that case.
		return True
	
	def validate_can_write(self, id) -> bool:
		if rest_exposer.current_accessor is None: return False
		if id is None: return rest_exposer.current_accessor.is_owner_user()
		page: Page = self.record_get_from_db(id)
		return page.get_user_write_access(rest_exposer.current_accessor.id)