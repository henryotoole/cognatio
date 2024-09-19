"""
Contains a class that connects the basic REST Schema to an SQL Alchemy Model.
"""
__author__ = "Josh Reed"

# Our code
from cognatio import env
from cognatio.util.dr_hitch import SchemaREST

# Other libs
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm.attributes import InstrumentedAttribute
from sqlalchemy import select
from flask import abort

# Base python
import typing
from pathlib import Path

class SchemaRSA(SchemaREST):
	"""SchemaRSA stands for Schema REST SQL Alchemy. It provides implementations for the `_action()` functions
	that connect this schema to an SQL table via SQL Alchemy. It implements all CRUD operations and others as
	specified below:
	+ get()			- Get record, serialize, and return it.
	+ post()		- Creation a new record using this schema's Marshmallow @post_load method
	+ put()			- Update an existing record with some data.
	+ delete()		- Delete a record. Waterfalling behavior will be dependent on the SQLA model.
	+ get_list() 	- Get a list of ID's with optional filtering by column name.
	+ get_bulk()	- Implemented in SchemaREST, but functional here.

	Don't forget that permissions will still need to be implemented in some child of this class (unless they
	are public read only). See SchemaREST's docstring for details.
	"""

	__db_model__ = None
	"""The database model class definition (e.g. UserModel) should be placed here by child Schema class
	"""
	__field_db_remap__ = {}
	"""A map of field names to db column names, for use when they are not identical (for example, when using
	getter/setters).
	"""
	__implemented_methods__ = ["GET", "POST", "PUT", "DELETE"]
	"""A list of HTTP methods that this schema actually has implementations for. Used by SchemaRSA, RFS, etc."""

	def record_get_from_db(self, id: int) -> DeclarativeBase:
		"""Method used by update(), get(), and delete() to actually retrieve the db record needed to perform
		actions on. If there is a peculiarity with getting this model by ID, this is the method to alter.

		Args:
			id (int): The ID of the record

		Returns:
			DeclarativeBase: Record instance or None if there's not one of that ID
		"""
		if self.__class__.__db_model__ is None:
			raise Exception(f"__db_model__ was not declared for {self.__class__.__name__}")
		return env.db.session.get(self.__class__.__db_model__, id)

	def _get(self, id: int) -> dict:
		"""Performs the default get operation. This simply checks the data table for this schema for a record that
		matches the provided ID and returns serialized data that is appropriate for the frontend in accordance
		with this schema's filtering and dump-only properties.

		This method, rather than get(), should be extended if more complex behavior is demanded by a child schema.

		Args:
			id (int): An integer ID

		Returns:
			dict: 'serialized' data of this Schema
		"""
		rec = self.record_get_from_db(id)
		if rec is None:
			abort(404, f"{self.__class__.__db_model__} {id} does not exist.")
		return self.dump(rec)
	
	def _create(self, data: dict) -> dict:
		"""Perform the defautl create operation. This will leverage the @post_load method, which must be defined
		in the child schema as creating a new instance of anything (but especially a database record) is
		often unique.

		This will, presumably, create a new database record. Flush will be called and autoincr ID included.

		Args:
			data (dict): The data that came along with the request

		Returns:
			dict: 'serialized' data of the new record
		"""
		record = self.load(data)
		return self.dump(record)
	
	def _update(self, id: int, data: dict) -> dict:
		"""Basic REST UPDATE operation. By default, any key/value pair in the provided 'data' dict will be
		applied to database record instance with setattr(). Validation will be performed in accordance with
		this schema's configuration beforehand.

		Some update behavior is pretty custom, and this REST function will likely need to be overwritten
		on occasion.

		Keep in mind that advanced update behavior may be more cleanly handled, in some cases, by using
		a getter/setter pair in the sqlalchemy model class.

		Args:
			id (int): An integer ID of the record to update
			data (dict): The data that came along with the request

		Returns:
			dict: 'serialized' data of the record after update
		"""
		# Ensure record exists
		rec = self.record_get_from_db(id)
		if rec is None:
			abort(404, f"{self.__class__.__db_model__} {id} does not exist.")

		# Validate supplied data
		self.validate(data)
		
		# Apply key/value pairs as attributes.
		for k, v in data.items():
			setattr(rec, k, v)

		env.db.session.commit()

		return self.dump(rec)
	
	def _delete(self, id: int):
		"""Delete a record by its ID. By default, this simply calls db.session.delete() on the record.

		Args:
			id (int): An integer ID of the record to delete
		"""
		# Ensure record exists
		rec = self.record_get_from_db(id)
		if rec is None:
			abort(404, f"{self.__class__.__db_model__} {id} does not exist.")

		env.db.session.delete(rec)
		env.db.session.commit()

	def _get_list(self, filter_data=None):
		"""Actually perform get list operation post-validation.

		Args:
			filter_data (dict, optional): Key/value data which is used to filter the returned ID.

		Returns:
			list: Of integer ID's.
		"""
		Model = self.__class__.__db_model__
		field_db_remap = self.__class__.__field_db_remap__
		if Model is None:
			raise Exception(f"__db_model__ was not declared for {self.__class__.__name__}")
		
		pk_cols = list(Model.__table__.primary_key)
		if len(pk_cols) > 1:
			raise NotImplementedError("No implementation for composite primary keys.")
		pk_col_name = pk_cols[0].name
		
		stmt = select(getattr(Model, pk_col_name))

		# Add WHERE statements for every filter param.
		if(filter_data is not None):
			for filter_k, filter_v in filter_data.items():
				# Remap is a poor way to solve this problem, but direct and simple.
				if filter_k in field_db_remap:
					filter_k = field_db_remap[filter_k]
					
				if not hasattr(Model, filter_k):
					self.abort_with_message(
						f"Can not filter by '{filter_k}' on {self.__class__.__name__}", 400
					)
				if not isinstance(getattr(Model, filter_k), InstrumentedAttribute):
					# It is not possible to evaluate the property without getting an instance of the model.
					self.abort_with_message(
							f"Can not filter by '{filter_k}' on {self.__class__.__name__}. Double check that the " +
							f"is not using a getter for that property. If so, use __field_db_remap__.",
							400
						)
				if filter_k in self.exclude:
					self.abort_with_message(
						f"Can not filter by excluded property '{filter_k}' on {self.__class__.__name__}", 401
					)
				stmt = stmt.where(
					getattr(Model, filter_k) == filter_v
				)

		exist = env.db.session.execute(stmt).all()
		ids = [x[0] for x in exist]
		return ids
	