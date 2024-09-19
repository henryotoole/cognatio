# tests/conftest.py
# Josh Reed 2024
#
# Will be executed by pytest when tests are run. Useful for declaring fixtures.

# Our code
from cognatio import cognatio_config, env
from cognatio.core.models import Base
from cognatio.util.db import DatabaseTesting

# Other libs
from flask import Flask
import pytest
from hacutils.filesys import mkdirs, folder_empty
import structlog

# Base python
import os
import pathlib
from redis import Redis

logger = structlog.get_logger()

######################################
### Setup filesystem path fixtures ###
######################################

_fpath_dev = os.path.join(pathlib.Path(__file__).parent.parent.resolve(), "dev")
mkdirs(_fpath_dev, folder=True)

@pytest.fixture(scope='module')
def fpath_dev() -> str:
	"""Fixture that returns the absolute filepath to the 'dev' directory.
	"""
	return _fpath_dev

####################################
### Alter relevant config values ###
####################################

cognatio_config['FPATH_PAGES'] = os.path.join(_fpath_dev, "fsys_test", "pages")
cognatio_config['FPATH_ETC'] = os.path.join(_fpath_dev, "fsys_test", "etc")

for fpath in [cognatio_config['FPATH_PAGES'], cognatio_config['FPATH_ETC']]:
	folder_empty(fpath)

redis_instance = Redis.from_url(
	cognatio_config['REDIS_URL'], db=cognatio_config['REDIS_DB_INDEX_TEST']
)

# Overwrite the function
env.namespace['db'] = "WILL_BE_SET_BY_FIXTURE"
env.namespace['redis'] = redis_instance

#####################################
### Declare other pytest fixtures ###
#####################################

@pytest.fixture
def tmpdir() -> str:
	"""Get a temporary directory which can be used to dump files. The directory is cleared upon the import of this
	fixture.

	Returns:
		str: Absolute filesystem path to an empty folder.
	"""
	tmp_path = os.path.join(_fpath_dev, 'tmp')
	if not os.path.exists(tmp_path):
		mkdirs(tmp_path)
	folder_empty(tmp_path)
	return tmp_path

@pytest.fixture
def redis_clear():
	"""Including this fixture in a test will ensure the env.redis db is emptied.
	"""
	redis_instance.flushdb()

@pytest.fixture(scope="session")
def test_db_module():
	"""Create a test database which will hook up to an sql database
	"""
	print("test_db_module()")

	tdbw = DatabaseTesting(cognatio_config['DB_URI_TEST'], Base)
	logger.info("Connection to test database established...")
	
	yield tdbw

	tdbw.teardown()

@pytest.fixture
def test_db(test_db_module: DatabaseTesting):
	"""This doesn't really create the test database, rather it takes the module-wide one and sets
	it up for one test run. Less overhead. We will ensure all tables are empty each time we open a session,
	just in case something was committed during a previous test. Things added with flush() will never persist,
	but production code sometimes makes use of commit().
	"""

	# Check that the persistent var has been cleared.
	if env.namespace['db'] != "WILL_BE_SET_BY_FIXTURE":
		raise ValueError("Persistent env.namespace['db'] variable has not been cleared properly after test!")

	with test_db_module.session_scope():
		

		test_db_module.session.flush()
		env.namespace['db'] = test_db_module
		yield test_db_module
		env.namespace['db'] = "WILL_BE_SET_BY_FIXTURE"

	# Always clean up lingering records afterwards.
	with test_db_module.session_scope():

		test_db_module.reset_all_tables()
		test_db_module.session.commit()

@pytest.fixture(scope="session")
def spoof_app_context():
	"""Yield within a 'spoof' flask app context. Pages with @app.route, etc. can be imported safely while
	within this context. No flask server will actually be run and these routes can not be tested, but other
	code within such imports can be used.
	"""

	app: Flask = Flask('cognatio')

	with app.app_context():
		
		yield app