"""
The WSGI entry point. This is called from a gunicorn command which is likely itself called from a systemd
process.
"""
from cognatio.web.flask.app import init_app
# Here 'app' is a somewhat magic word that's referred to by the gunicorn invocation to get the flask object.
# It can be changed of course, but the gunicorn invocation must also change.
app = init_app()

if __name__ == '__main__':
	app.run()