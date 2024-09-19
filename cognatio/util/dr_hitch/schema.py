"""The base schema which provides some bottom-level functionality for schemas that a REST api will
work with.
"""
__author__ = "Josh Reed"

# Our code

# Other libs
import flask
from werkzeug.exceptions import HTTPException
from marshmallow import Schema, ValidationError

# Base python
from pathlib import Path

class SchemaREST(Schema):
	"""This is a basic extension of the Marshmallow schema with behaviors modified for use with REST API's.
	This class provides a base level *implementation* of a resource that will be exposed to REST routes. The
	methods that are 'exposed' are listed below:
	+ get()			- Get
	+ post()		- Creation
	+ put()			- Update
	+ delete()		- Delete
	+ get_list() 	- Get a list of ID's with optional filtering
	+ get_bulk()	- Get data for a list of ID's using get(). Merely a loop.

	Not all methods are, of course, available for all schema's. Whether or not a methods is intended to be
	exposed for a certain schema is controlled by the `__allowed_methods__` class attribute. If, for example,
	"GET" was an allowed method, then all rest functions that begin with `get` would be exposed.

	**Permissions**
	Permissions are handled by validate_can_read() and validate_can_write(). These functions will need to be
	overwritten for all non-public Schema's. They are given an "id" and "accessor identity" and should return
	a boolean that indicates whether that accessor has read or write access to that ID.

	`GET` is considered a read operation, and `PUT`, `POST`, and `DELETE` are all considered write operations.

	**On Implementations**
	Implementations of this class will find that every action (for example, `get()`) is broken into two steps:
	1. The original `action()` function, which is called. It validates access and then forwards the action to:
	2. A sub-function `_action()`, which actually does the action.

	A child class can override the `action()` function to change the nature of validation or the `_action()`
	function to change the nature of the action itself.

	The base SchemaREST class does not provide **any** default implementation for the `_action()` functions,
	as it does not make assumptions about what is upstream from the schema. Possible 'upstream' targets could
	be SQLAlchemy or a filesystem.
	"""

	__rest_path__ = None
	"""Base path for this schema to be exposed at. See path() docstring for more info."""
	__allowed_methods__ = []
	"""A list of HTTP methods that are allowed to be exposed to the web, e.g. GET, POST, PUT and DELETE"""
	__implemented_methods__ = ["GET", "POST", "PUT", "DELETE"]
	"""A list of HTTP methods that this schema actually has implementations for. Used by SchemaRSA, RFS, etc."""
	

	def handle_error(self, exc, data, **kwargs):
		"""Raise a custom exception when (de)serialization fails as per the docs. Here is where SchemaRSA
		converts ValidationError to HTTPException

		Args:
			exc (ValidationError): The raised validation error
			data (dict): The original data dict, some or all of which failed validation.
		"""
		self.abort_from_validation(exc)

	def abort_from_validation(self, exc: ValidationError):
		"""
		Convert the provided validation error into a werkzeug HTTPException.

		Raises:
			HTTPException
		"""
		try:
			flask.abort(400)
		except HTTPException as e:
			# valfails = {'email': ['Not a valid email address.']}
			e.description = f"Provided data fails validation: {exc.messages}"
			raise

	def abort_with_message(self, msg: str, code: int):
		"""Raises an HTTPException with a message and a code.

		Args:
			msg (str): The message for the exception
			code (int): The code for the exception

		Raises:
			HTTPException
		"""
		try:
			flask.abort(code)
		except HTTPException as e:
			e.description = msg
			raise

	@property
	def path(self) -> str:
		"""Get the path for accessing this resource. This is the path that will be used to access bulk and
		individual operations for the schema.
		
		Returns:
			str: The path for this schema, as a relative path.
		"""
		if self.__rest_path__ is None:
			raise ValueError(f"Schema {self.__class__.__name__} has not defined an __rest_path__ variable.")
		return self.__rest_path__.lstrip('/')
	
	@property
	def name(self) -> str:
		"""The 'name' of this resource. This is the word at the end of the url that this resource is accessed
		at. It is interpreted from the path.

		Returns:
			str: Name of the resource
		"""
		return Path(self.path).stem
	
	@property
	def allowed_methods(self) -> 'list[str]':
		"""A whitelist of HTTP Methods that may be exposed to the internet for a REST API.
		
		Returns:
			list[str]: List of allowed HTTP methods, by name and in all caps (e.g. GET, POST, PUT)
		"""
		valid = self.__implemented_methods__
		for method in self.__allowed_methods__:
			if not method in valid:
				raise ValueError(f"Invalid method: {method}. Must be one of '{valid}'.")
		return self.__allowed_methods__
	
	def validate_can_read(self, id, accessor_identity) -> bool:
		"""This is a base method that should be implemented by a child Schema class. This validates an already-
		authenticated credential for read access to this instance of the schema.

		The `accessor_identity` is determined by whatever the FRSA Spur's `authenticate_creds()` method returns.
		For example, it might be an instance of a User class as used by flask_login.

		"Read access" refers to any operation that gets information about a resource. This would include the
		classical get() method, as well as any get_by_filter() methods.

		Args:
			id (*): The ID of the schema instance to be read or None if a list is attempted.
			accessor_identity (*): The identity of the API accessor. None if anonymous.

		Returns:
			bool: Whether or not the accessor has read access to instances of this schema
		"""
		return True
	
	def validate_can_write(self, id, accessor_identity) -> bool:
		"""This is a base method that should be implemented by a child Schema class. This validates an already-
		authenticated credential for write access to this instance of the schema.

		The `accessor_identity` is determined by whatever the FRSA Spur's `authenticate_creds()` method returns.
		For example, it might be an instance of a User class as used by flask_login.

		"Write access" refers to any operation that modifies a resource. This would include the classical
		create, update, and delete methods.

		Args:
			id (*): The ID of the schema instance to be written or None if a creation is attempted.
			accessor_identity (*): The identity of the API accessor. None if anonymous.

		Returns:
			bool: Whether or not the accessor has write access to instances of this schema
		"""
		return False
	
	def get(self, id: int, accessor_identity) -> dict:
		"""Validate and perform the basic GET operation on a schema instance of the provided ID.

		Args:
			id (int): An integer ID
			accessor_identity (*): The identity of the API accessor making this request.

		Returns:
			dict: 'serialized' data of this Schema
		"""
		if not self.validate_can_read(id, accessor_identity): self.abort_with_message("User lacks auth", 403)

		return self._get(id)
	
		
	def post(self, data: dict, accessor_identity) -> dict:
		"""Validate and perform the basic POST operation on a schema instance of the provided ID. By default
		this will create a new instance. See _create().

		Args:
			id (int): An integer ID
			accessor_identity (*): The identity of the API accessor making this request.

		Returns:
			dict: 'serialized' data of this Schema
		"""
		if not self.validate_can_write(None, accessor_identity): self.abort_with_message("User lacks auth", 403)

		return self._create(data)
		
	def put(self, id: int, data: dict, accessor_identity) -> dict:
		"""Validate and perform the basic PUT operation on a schema instance of the provided ID. By default, this
		will update an existing record with the provided data. See _update().

		Args:
			id (int): The ID of the resource to update
			data (dict): The data that came along with the request
			accessor_identity (*): The identity of the API accessor making this request.

		Returns:
			dict: 'serialized' data of the record after update
		"""
		if not self.validate_can_write(id, accessor_identity): self.abort_with_message("User lacks auth", 403)

		return self._update(id, data)
	
	def delete(self, id: int, accessor_identity):
		"""Validate and delete a record by its ID.

		Args:
			id (int): An integer ID of the record to delete
			accessor_identity (*): The identity of the API accessor making this request.
		"""
		if not self.validate_can_write(id, accessor_identity): self.abort_with_message("User lacks auth", 403)

		return self._delete(id)
	
	def get_list(self, accessor_identity, filter_data=None) -> list:
		"""Return a list of ID's for all available ID's in this Schema's table.

		**On Filtering**
		Filtering is made automatically possible via the included 'filter_data' arg. When it is provided,
		it will take the form {"k1": "v1", "k2": "v2", ...}. The returned ID's should all have record data
		rows "k1" that have value "v1" and "k2" with "v2", etc.

		Record data that is excluded from serialization (for example, user passhash) is not allowed for filtering
		and will trip an error.

		Args:
			accessor_identity (*): The identity of the API accessor making this request.
			filter_data (dict, optional): Key/value data which is used to filter the returned ID.

		Returns:
			list: Of integer ID's.
		"""
		if not self.validate_can_read(None, accessor_identity): self.abort_with_message("User lacks auth", 403)
		
		return self._get_list(filter_data=filter_data)
	
	def get_bulk(self, ids: list, accessor_identity) -> dict:
		"""Get bulk data for the list of ID's provided. This should be identical to get(), except combined
		into a single action (e.g. request)

		Args:
			ids (list): A list of ID's to fetch data for.
			accessor_identity (*): The identity of the API accessor making this request.

		Returns:
			dict: A dict that maps ID's to data-dicts (as would be returned by get())
		"""

		out_struct = {}
		for id in ids:
			out_struct[id] = self.get(id, accessor_identity)
		return out_struct
	
	def _get(self, id: int) -> dict:
		"""Implements the actual action of performing get().

		Args:
			id (int): An integer ID

		Returns:
			dict: 'serialized' data of this Schema
		"""
		pass
	
	def _create(self, data: dict) -> dict:
		"""Implements the actual action of performing create().

		Args:
			data (dict): The data that came along with the request

		Returns:
			dict: 'serialized' data of the new record
		"""
		pass
	
	def _update(self, id: int, data: dict) -> dict:
		"""Implements the actual action of performing update().

		Args:
			id (int): An integer ID of the record to update
			data (dict): The data that came along with the request

		Returns:
			dict: 'serialized' data of the record after update
		"""
		pass
	
	def _delete(self, id: int):
		"""Implements the actual action of performing delete().

		Args:
			id (int): An integer ID of the record to delete
		"""
		pass

	def _get_list(self, filter_data=None):
		"""Implements the actual action of performing get_list().

		Args:
			filter_data (dict, optional): Key/value data which is used to filter the returned ID.

		Returns:
			list: Of integer ID's.
		"""
		pass