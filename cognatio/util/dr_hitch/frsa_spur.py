"""
Flask-REST-SQLAlchemy spur extension. Responsible for opening a SchemaREST up to the internet via flask.

NOTE: This will eventually be moved to hacutils
"""
__author__ = "Josh Reed"

# Our code
from cognatio.util.dr_hitch import SchemaRSA, SchemaRFS, SchemaREST

# Other libs
from flask import Flask, request, jsonify
from flask_login import current_user
from apispec import APISpec
from apispec.ext.marshmallow import MarshmallowPlugin

# Base python
import os
import json
import base64

class FRSASpur:
	"""The FRSA Spur class is simply a layer of automation that exposes the correct functions within
	a schema via flask routes. All critical information about the REST API methods (validation, paths,
	versioning, etc.) is contained within the schema itself.

	**Architecture**
	The FRSASpur is responsible for separating flask request context methods from everything else. This means
	that the Spur handles:
	+ Creation of routes.
	+ Parsing and decoding of request parameters.
	+ Authentication (but **not** validation) of the accessor's identity.

	**Documentation**
	Documenation for the API is automatically generated by the Spur as schemas are registered. An access point
	for the documentation to be fetched publically will also be made available at base_path/docs

	**Instantiation**
	Create an FRSASpur with the following steps:
	1. Instantiate the spur
	2. Call init_app() with the flask application.
	3. Within the app_context, call register_routes() to setup routes.

	**Routes / REST Architecture**
	The routes that can be automatically set up depend on the specific Schema's being used and what routes they
	themselves enable. Below is an exhaustive list of all possible routes:

	```
	URL                    | METHOD  | Action
	-----------------------+---------+-----------------------------------
	'.../noun'             | GET     # Get a list of available ID's
	'.../noun'             | POST    # Create a new 'noun'
	-----------------------+---------+-----------------------------------
	'.../noun/<id>'        | GET     # Get data for a specific 'noun'
	'.../noun/<id>'        | PUT     # Update data for a specific 'noun'
	'.../noun/<id>'        | DELETE  # Delete a 'noun'
	-----------------------+---------+-----------------------------------
	'.../noun_get_filtered?filter={"key", "val"}'
	                       | GET     # Get a list of 'noun' ID's that match filter
	'.../noun_get_bulk?ids=[...]'
	                       | GET     # Get data for several 'nouns'
	-----------------------+---------+-----------------------------------
	```
	
	Some additional information for the more non-standard routes is shown below:

	+ `/noun_get_bulk?ids=[1, 2, 3]` - Will return bulk data for the requested ID's `{1: {DATA}, 2: {DATA, ...}}`
	+ `/noun_get_filtered?filter={"key", "val"}` - Will return all ID's where record data row "key" has value 
	equal to "val".	Filtering can only be applied to record data that is not excluded from responses.
	
	**Todo**
	+ Add path doc generation.
	+ Keep an eye on the authenticate_creds() system as various needs are placed on this library. It might be
	too simple or cluttered in the long run.
	+ Alter the routes_create functions to not use big switch cases. This is obviously bad practice, but I
	haven't worked with REST enough to yet understand the nuances. Speculating now would be a mistake so in the
	meantime I'll be verbose.
	"""

	def __init__(self, title: str, version: str, base_path: str="/"):
		"""Instantiate the spur. Right now, this ONLY follows the flask lazy-loading init_app methodology.

		Args:
			title (str): The name of this 'api' as it will be exposed to the world.
			version (str): The official version of this 'api' as it will be exposed to the world.
			base_path (str, optional): The base path for all connected schema routes. This is especially useful
				for versioning. Defaults to '/', or root.
		"""

		self.app = None
		self._schemas = []
		self._registered = False
		self._paths_registered = {}
		self.base_path = base_path
		self.title = title
		self.version = version

		# Add in our APISpec
		self.spec = APISpec(
			title=title,
			version=version,
			openapi_version="3.1.0",
			plugins=[MarshmallowPlugin()]
		)

	def init_app(self, app: Flask):
		"""Connect the flask app to the spur. Routes are setup at this stage.

		Args:
			app (Flask): The flask app for the project
		"""
		if self.app is not None:
			return
		
		self.app = app

	def authenticate_creds(self):
		"""This method is responsible for **authenticating** the API accessor. This does not ensure that
		the accessor has the permissions to access/modify various parts of the API. It **only** ensures
		that the accessor is who they say they are.

		This method should use credentials in the current flask request context to determine the identity
		of the API accessor. This identity should be returned as a result of this function. It will be
		forwarded to various schema validation methods.

		By default, this method will merely return the flask_login user. However, this method can be extended
		by a child to change behaviors.

		Returns:
			*: The identity of the accessor (which can take many forms) or None if anonymous.
		"""
		if current_user is None: return None
		if current_user.is_anonymous: return None
		return current_user

	def register_routes(self):
		"""Register routes for all schemas associated with this spur. After this is called, no further schemas
		can be registered.
		"""
		self._registered = True

		# Add routes called for by all schemas
		for schema in self._schemas:
			self._routes_create(schema)

		# Lastly, expose the docs for this spur
		doc_json_str = json.dumps(self.spec.to_dict())
		def doc_return():
			return doc_json_str
		self._add_url_rule(os.path.join(self.base_path, 'docs'), f"doc_{self.title}_{self.version}", doc_return)
		
		#TMP
		#print(json.dumps(self.spec.to_dict(), indent='\t'))

	def register_schema(self, schema: SchemaRSA):
		"""Register a new schema with this FRSA spur. This will either add the neccessary routes now if
		init_app() has already been called, or remember the schema and register when init_app() is called.

		Args:
			schema (SchemaRSA): The RSA schema to bind the API routes to.
		"""
		if self._registered:
			raise ValueError("Schemas can not be added after register_routes() has been called.")
		self._schemas.append(schema)

	def _routes_create(self, schema: SchemaREST):
		"""Create the flask routes needed to expose this schema to the public internet. The schema contains
		path information as well as which HTTP methods to allow.

		Args:
			schema (SchemaRSA): An RSA schema.
		"""
		# Check whether this will create a collision with existing schema's paths. Flask would catch this
		# anyhow, but this enables the creation of more clear exception raising.
		for existing_path, existing_schema in self._paths_registered.items():
			if existing_path == schema.path:
				raise ValueError(f"Schema {schema.__class__.__name__} overwrites existing path "+\
					f"'{existing_path}' for {existing_schema.__class__.__name__}")

		# Then actually create the flask routes.
		for method in schema.allowed_methods:
			if method == "GET":
				self._routes_create_GET_methods(schema)
			elif method == "POST":
				self._routes_create_POST_methods(schema)
			elif method == "PUT":
				self._routes_create_PUT_methods(schema)
			elif method == "DELETE":
				self._routes_create_DELETE_methods(schema)

		# Lastly, bind the schema and associated paths to the spec that is a-building.
		self.spec.components.schema(schema.name, schema=schema)
		# TODO add paths to this. For now, I'm going to proceed until I understand better the frontend
		# side of things and that's really needed.

	def _add_url_rule(self, rule, endpoint, view_function, **kwargs):
		"""A forwarding function to flask app.add_url_rule(). In the future, this will be where I automatically
		generate Open API docs for paths.
		"""
		#print(f"Bound URL to {rule}")
		self.app.add_url_rule(rule, endpoint, view_function, **kwargs)

	def _routes_create_GET_methods(self, schema: SchemaREST):
		"""Create all GET routes for a schema. Checks for collision and whether GET is allowed are performed
		before this method is called.

		Args:
			schema (SchemaREST): The schema in question.
		"""

		# Define transfer functions
		def transfer_get(id):

			accessor = self.authenticate_creds()
			out = schema.get(id, accessor)
			return jsonify(out)
		
		def transfer_get_list():

			accessor = self.authenticate_creds()
			out = schema.get_list(accessor)
			return jsonify(out)
		
		def transfer_get_filtered():

			accessor = self.authenticate_creds()
			filter = json.loads(base64.b64decode(request.args['filter']))
			out = schema.get_list(accessor, filter_data=filter)
			return jsonify(out)
		
		def transfer_get_bulk():

			accessor = self.authenticate_creds()
			ids = json.loads(base64.b64decode(request.args['ids']))
			out = schema.get_bulk(ids, accessor)
			return jsonify(out)

		base_endpoint = f"endpoint_{schema.__class__.__name__}"
		ops = [
			[
				f"{base_endpoint}_GET",
				os.path.join(self.base_path, schema.path, "<string:id>"),
				transfer_get
			],
			[
				f"{base_endpoint}_get_list",
				os.path.join(self.base_path, schema.path),
				transfer_get_list
			],
			[
				f"{base_endpoint}_get_filtered",
				os.path.join(self.base_path, schema.path + "_get_filtered"),
				transfer_get_filtered
			],
			[
				f"{base_endpoint}_get_bulk",
				os.path.join(self.base_path, schema.path + "_get_bulk"),
				transfer_get_bulk
			],
		]
		
		for op in ops:
			endpoint, route_path, transfer_fn = op
			self._add_url_rule(route_path, endpoint, transfer_fn, methods=["GET"])

	def _routes_create_POST_methods(self, schema: SchemaREST):
		"""Create all POST routes for a schema. Checks for collision and whether POST is allowed are performed
		before this method is called.

		Args:
			schema (SchemaREST): The schema in question.
		"""
		def transfer_post():

			accessor = self.authenticate_creds()
			data = request.get_json()
			out = schema.post(data, accessor)
			return jsonify(out)
		
		ops = [
			[
				f"endpoint_{schema.__class__.__name__}_POST",
				os.path.join(self.base_path, schema.path),
				transfer_post
			],
		]

		for op in ops:
			endpoint, route_path, transfer_fn = op
			self._add_url_rule(route_path, endpoint, transfer_fn, methods=["POST"])

	def _routes_create_PUT_methods(self, schema: SchemaREST):
		"""Create all PUT routes for a schema. Checks for collision and whether PUT is allowed are performed
		before this method is called.

		Args:
			schema (SchemaREST): The schema in question.
		"""
		def transfer_put():

			accessor = self.authenticate_creds()
			data = request.get_json()
			out = schema.put(id, data, accessor)
			return jsonify(out)
		
		ops = [
			[
				f"endpoint_{schema.__class__.__name__}_PUT",
				os.path.join(self.base_path, schema.path, "<string:id>"),
				transfer_put
			],
		]

		for op in ops:
			endpoint, route_path, transfer_fn = op
			self._add_url_rule(route_path, endpoint, transfer_fn, methods=["PUT"])

	def _routes_create_DELETE_methods(self, schema: SchemaREST):
		"""Create all DELETE routes for a schema. Checks for collision and whether DELETE is allowed are performed
		before this method is called.

		Args:
			schema (SchemaREST): The schema in question.
		"""
		def transfer_delete():

			accessor = self.authenticate_creds()
			schema.delete(id, accessor)
			return jsonify({})
		
		ops = [
			[
				f"endpoint_{schema.__class__.__name__}_DELETE",
				os.path.join(self.base_path, schema.path, "<string:id>"),
				transfer_delete
			],
		]

		for op in ops:
			endpoint, route_path, transfer_fn = op
			self._add_url_rule(route_path, endpoint, transfer_fn, methods=["DELETE"])