"""
This file contains the Env class, which is responsible for ensuring that system-wide environmental variables
are lazy-loaded, cached, and properly available to hot-swap when tests are running.

NOTE: If celery ever becomes involved in this project, care will have to be taken to ensure that these
		vars are properly 'namespaced'. I'll have to look, into past projects for that.
"""
__author__ = "Josh Reed"

# Our code
from cognatio import cognatio_config, project_path

# Other libs
from flask import has_request_context
from redis import Redis
from hacutils.db import Database
import structlog

# Base python
import os

# Declare all getter functions for our env module in one go.
class Env:

	def __init__(self):
		"""Create a new and empty environment container.
		"""
		# Here is where instances are stored for access in an environment.
		self.namespace = {}

	
	@property
	def fpath_static(self) -> str:
		"""This is an internal folder (e.g. within the code filestructure) that is exposed freely to the internet
		with nginx in production and with flask in development. Anything here is available to the world without
		authentication.

		Returns:
			str: Absolute filepath
		"""
		return os.path.join(project_path, 'cognatio', 'web', 'static')

	@property
	def fpath_pages(self) -> str:
		"""This folder contains all the pages (nodes) of the cognatio network. This folder is directly exposed
		to the world via nginx (and an authentication layer).

		Returns:
			str: Absolute filepath
		"""
		return os.path.join(cognatio_config['FPATH_LOCAL'], 'pages')
	
	@property
	def fpath_etc(self) -> str:
		"""A folder to drop files in that has no exposure to the outside world via nginx.

		Returns:
			str: Absolute filepath
		"""
		return os.path.join(cognatio_config['FPATH_LOCAL'], 'etc')
	
	@property
	def fpath_static_local(self) -> str:
		"""A folder for statically accessible resources similar to fpath_static, except for 'local' files that
		are generated during the use of cognatio and unique to the particular installation.

		For example, a user-created css file for a series of cognatio documents would belong here.

		Returns:
			str: Absolute filepath
		"""
		return os.path.join(cognatio_config['FPATH_LOCAL'], 'static')

	@property
	def redis(self) -> Redis:
		"""Get the Redis database connection object. This is instantiated once per namespace and is swapped
		only for pytest.

		Returns:
			Redis: _description_
		"""
		namespace = self.namespace
		if not 'redis' in namespace:
			namespace['redis'] = Redis.from_url(
				cognatio_config['REDIS_URL'], db=cognatio_config['REDIS_DB_INDEX']
			)
		return namespace['redis']
	
	@property
	def db(self) -> Database:
		"""Get the sqlalchemy Database connection for this environment. This is instantiated once per 
		namespace but can be swapped out for a number of reasons.

		The possible contexts under which a database is needed are as follows:
		A) simple 	and non-test	: For background tasks and command-line scripts
		B) flask 	and non-test	: For code executing under the flask application context
		C) simple 	and test		: Background tasks when testing
		D) flask 	and test		: Flask code when testing

		Option D) should not really occur. Testing flask routes is unwieldy. It's better to make routes call
		their own 'helper' functions as soon as possible, and test the helper functions.

		Returns:
			Database: The correct database to use given the context.
		"""
		# Flask always gets its own database back
		if has_request_context():
			# This must be imported here, otherwise strangeness occurs.
			from cognatio.web.flask import db_flask # Note: this won't work unless used within a flask context.
			return db_flask
		
		namespace = self.namespace
		
		# Otherwise instantiate and return the direct database connection.
		if not 'db' in namespace:
			namespace['db'] = Database(cognatio_config['DB_URI'])

		# If it's a function, we should call it. Test database needs to be a function.
		_db = namespace['db']

		return _db
	