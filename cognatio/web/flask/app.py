"""Flask app factory, configuration, et. al.
"""
__author__ = "Josh Reed"

# Our code
from cognatio import cognatio_config, env

# Other libs
from flask import Flask, has_app_context
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, current_user
from dispatch_flask import DispatcherFlask
from restlink import ExposerFlask

# Base python


# Instantiate the plugins that need to be importable from elsewhere.
db_flask = SQLAlchemy()
rest_exposer = ExposerFlask()
login_manager = LoginManager()
dispatcher = DispatcherFlask(redis_instance=env.redis)

# Any imports that rely on the above singletons
import cognatio.web.flask.rest

def init_app():
	"""This method is a factory that produces the Flask application object. This will:
	1. Create the app.
	2. Apply config from the central cognatio config file
	3. Initialize any 'plugins' like FlaskSession or Flask SQLAlchemy
	4. Create the app context and within that:
		1. Setup routes
		2. Register blueprings
		3. Return the app
	"""
	if has_app_context():
		raise Exception("make_app is being called when an app context already exists.")

	# 1. Create
	app: Flask = Flask('cognatio')
	
	# 2. Configure
	configure_app(app)

	# 3. Initialize plugins
	db_flask.init_app(app)
	rest_exposer.init_app(app)
	login_manager.init_app(app)
	dispatcher.init_app(app)
	import cognatio.web.flask.login

	# 4. Context
	with app.app_context():
		# 4.1 Routes
		import cognatio.web.routes

		# 4.2 Blueprints

		# 4.3 Return app
		return app


def configure_app(app: Flask):
	"""Apply cognatio config keys to the flask app keys. 

	Args:
		app (Flask): Flask application
	"""
	app.config['SQLALCHEMY_DATABASE_URI'] = cognatio_config['DB_URI']
	app.config['SECRET_KEY'] = cognatio_config['FLASK_SECRET_KEY']
	# CSRF: This absolves the need for CSRF tokens, which are especially inconvenient for the Cognatio project
	# as I don't want to have to template every single web page that is served.
	app.config['SESSION_COOKIE_SAMESITE'] = "Strict"