"""
Toplevel access to system terminal
"""
__author__ = "Josh Reed"

# Our code
from cognatio import cognatio_config, env
from cognatio.core.models import Base
from cognatio.core.graph import PageScanner
from cognatio.util.db import DatabaseTesting

# Other libs
import fire
#from hacutils.db import DatabaseTesting

# Base python

def term():
	"""Start the cognatio interactive terminal system.
	"""
	pass

def backup():
	"""One day this will run the system backup (clone?) and prompt further options if not provided. Probably
	better to have this be a class? Not going to speculate yet.
	"""
	pass

def scan():
	"""Manually run a newtork-wide page scan, to update page mass numbers and edge table.
	"""
	with env.db.session_scope():
		scanner = PageScanner()
		scanner.scan()

def dev(action:str):
	"""Development methods. Specify an action:

	db_reset	: Completely destroy all old table definitions and replace with current ones as defined in code.
	flask		: Launch the flask development server

	Args:
		action (str): The action to perform. See above.
	"""
	if action == 'db_reset':
		# Handy little trick.
		DatabaseTesting(cognatio_config['DB_URI'], Base)
	elif action == 'flask':
		from cognatio.web.flask.app import init_app
		app = init_app()
		app.run(debug=True)
	else:
		print("Urecognized action")


# Fire can do much more interesting things in the long run. See BinaryCanvas
# https://github.com/google/python-fire/blob/master/docs/guide.md
def fire_term():
	"""Fire off the Fire() command that translates command line utility into action within this module.
	"""
	available = {
		'term': term,
		'backup': backup,
		'scan': scan,
	}

	if cognatio_config['IS_DEV']:
		available['dev'] = dev

	fire.Fire(available)