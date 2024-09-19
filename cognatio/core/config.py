"""
A file where we declare and typehint the config that is used for all of Cognatio.
"""
__author__ = "Josh Reed"

# Our code

# Other libs

from hacutils.config import CfgEntry

# Base python
from typing import TypedDict

# This exists only to typehint the config object.
class CognatioConfig(TypedDict):
	FPATH_PAGES: str
	FPATH_ETC: str
	DB_URI: str
	DB_URI_TEST: str
	REDIS_URL: str
	REDIS_DB_INDEX: int
	REDIS_DB_INDEX_TEST: int
	FLASK_SECRET_KEY: str
	OWNER_USER_ID: int
	WEB_HOSTNAME: str
	IS_DEV: bool

CONFIG_DEFAULTS = [
	CfgEntry('FPATH_PAGES', default=None, comment="Absolute path to flat folder that contains all cognatio pages."),
	CfgEntry('FPATH_ETC', default=None, comment="Absolute path to a folder for misc files. Should not be "+ \
		  	"accessible via nginx."),
	CfgEntry('DB_URI', default=None, comment="A URI that points to the SQL database to use. Of the form: "+ \
		  	"mysql+pymysql://root:$password@localhost/$dbname"),
	CfgEntry('DB_URI_TEST', default=None, comment="A URI that points to the test SQL database to use. Can be "+ \
		  	"omitted if this is a production installation where tests are not intended to be run."),
	CfgEntry('REDIS_URL', default="redis://", comment="A URL that points to a redis or valkey server."),
	CfgEntry('REDIS_DB_INDEX', default=0, comment="The redis db index to use."),
	CfgEntry('REDIS_DB_INDEX_TEST', default=1, comment="The redis db index to use for tests. Can be omitted if "+ \
		  	"this is a production installation where tests are not intended to be run."),
	CfgEntry('FLASK_SECRET_KEY', default=None, comment="Complex string to be this flask's secret key."),
	CfgEntry('WEB_HOSTNAME', default=None, comment="The domain at which this Cognatio instance will be hosted " + \
			"e.g. www.example.com"),
	CfgEntry('OWNER_USER_ID', default=None, comment="ID of the 'owner user' with universal write access."),
	CfgEntry('IS_DEV', default=False, comment="Set to True if this is a development environment."),
]