# docs/sysadmin.md
# Josh Reed 2024
#
# The following are notes on the different backing services and sysadmin tasks needed to install and maintain
# cognatio.

### Foreword ###
Cognatio is very much a personal project. I'm not certain that others besides those I know personally will ever set up their own cognatio installations. The following guide is informal and will require good GNU skills and possibly some debugging.

In the future, I'd love to return to this project from a sysadmin point of view and create a package that's easy to install and maintain.





### Required Packages ###
To setup and use cognatio, several packages and tools will need to be installed. This includes:
+ nginx or some other webserver / reverse proxy. In this guide I'll simply refer to nginx.
+ an SQL server
+ redis or valkey
+ python
+ a variety of pip libraries (see requirements.txt)
+ two python libraries I built myself that aren't on pip yet (hacutils and dispatch_server)

Basic steps for installing these on a Ubuntu-like system are below.





### Filesystem ###
This project relies on a some filesystem setup that is mostly, but not entirely, automatic. The reader will need to choose a 'local' directory (see below). Further notes on the filesystem schema used by cognatio are also below.

**The Local Directory**
All files which are generated during the use of cognatio are considered local. A directory must be made on the installation machine which contains these files. This includes pages, local static files, and others.

The path to the directory for these files is specified in cognatio.cfg under the "FPATH_LOCAL" key.

Two of the subdirectories under local will need to be exposed to the world via nginx. This means that the local directory must be:
1. Traversable, meaning that execute permissions for nginx must exist on every folder up to root.
2. Readable, meaning that nginx can read files within.

This may be achieved by giving 'others' execute permissions all the way up to root, and 'others' read permissions on all files within local. More complex arrangements can be made if the nginx group is placed on the files, of course.

**The Pages Local Subdirectory**
The pages (or nodes) that actually make up the cognatio system are stored in a flat file structure. These files can be navigated and read as normal HTML webpages. They sit behind an authentication layer (nginx -> flask) but are served by nginx.

This directory will be setup automatically wherever the config tells it to when cognatio runs, if it does not already exist. It may not have permission to do this, and will complain about it if so.

**The Static Local Subdirectory**
A static directory will also be automatically setup when cognatio runs. This is a location to place shared resources like icons, css files, scripts, etc. that are written uniquely for the cognatio installation. Not to be confused with the cognatio code's internal 'static' directory, which serves non-unique static files. 





### Backing Services ###

**Valkey / Redis**
I happen to be setting this up in the near-wake of the redis disaster. Every able-minded group seems to be in the process of switching to Valkey, which is convenient as ideologically I agree with the move.

I've built Valkey from source and run it as systemd. However, I use the python 'redis' package as commands for Valkey and Redis are seemingly identical. Either server should work.

**SQL**
An SQL server will need to be available. Any should do, and the access URI shall be specified in cognatio.cfg.






### Logs ###
With logs I follow the doctrine spelled out here: https://12factor.net/logs. This means that all logs are sent
to stdout and stderr. For production installations, I recommend using systemd and allowing logs to hit journalctl.

However, if manual rotating logs are desired, one can slap | multilog n2 /var/log/cognatio 2>&1 at the end of the ExecStart command in the systemd service file. See https://cr.yp.to/daemontools/multilog.html for some unfathomably based documentation on multilog.

Note the use of a runtime directory that enables workspace at /run/cognatio. Logs could perhaps go in here too.

If installed as indicated in this document, logs for cognatio can be tracked with `journalctl -f -u cognatio`. Both stdout and stderr should show up.






### Config ###
# TODO document nature of config paths and create a way to generate config.






### SystemD ###
Recommended service file style:
```conf
[Unit]
Description=Starts/stops the Cognatio server.
After=network.target

[Service]
User={{YOUR_USE}}
Group={{YOUR_GROUP}}
RuntimeDirectory=cognatio
WorkingDirectory={{YOUR_INSTALL_DIR}}/cognatio/
Environment="PATH={{YOUR_INSTALL_DIR}}/venv/bin"
ExecStart={{YOUR_INSTALL_DIR}}/venv/bin/gunicorn --workers 3 --bind unix:/run/cognatio/cognatio.sock -m 007 cognatio.web.wsgi:app

[Install]
WantedBy=multi-user.target
```






### Nginx ###
Nginx is responsible for providing internet-facing access to the following:

socket		| /			| /run/cognatio/cognatio.sock	| The socket at which the gunicorn server broadcasts
pages		| /page		| $local/pages					| Public but authorized access to pages
static local| /sl		| $local/static					| Public unauthenticated access to local static resources
static		| /s		| $repo/cognatio/web/static		| Public unauth access to cognatio static resources
nav			| /nav		| $repo/cognatio/web/static/nav	| Public unauth access to nav app resources

See the sample file below and comments for more info on each of these.

Example configuration file:
```conf
# NginX config for cognatio

#####################################################################
#                            PRODUCTION                             #
#####################################################################

# Forward to 443 block.
server {
	listen [::]:80;
	listen 80;
	server_name {{YOUR_HOSTNAME}};

	location / {
		return 301 https://{{YOUR_HOSTNAME}}$request_uri;
	}
}

server {
	server_name {{YOUR_HOSTNAME}};
	listen [::]:443 ssl http2;
	listen 443 ssl http2;
	
	# Last manually updated 2024-09-19
	ssl_certificate /etc/letsencrypt/live/{{YOUR_HOSTNAME}}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/{{YOUR_HOSTNAME}}/privkey.pem;
	include /etc/nginx/snippets/ssl.conf;

	# Connect all non-special routes to the flask server via gunicorn and a socket. 
	location / {
		etag on;
		include proxy_params;
		proxy_pass http://unix:/run/cognatio/cognatio.sock;
		# Required for auth_request directive so that the URL can be parsed by flask.
		proxy_set_header X-Original-URI $request_uri;
	}

	# Open up page directory but with authentication and authorization.
	location /page {
		# Forward the request to the flask server. This will check the logged-in user against the database
		# and determine whether they have access to this page.
		auth_request /auth/page;

		etag on;
		
		alias {{YOUR_LOCAL_DIRECTORY}}/pages;
	}

	# Simply broadcast static local directory
	location /sl {
		etag on;
		alias {{YOUR_LOCAL_DIRECTORY}}/static;
	}

	# Simply broadcast static directory
	location /s {
		etag on;
		alias {{YOUR_INSTALL_DIRECTORY}}/cognatio/web/static;
	}

	# Simply broadcast nav static directory
	location /nav/ {
		etag on;
		alias {{YOUR_INSTALL_DIRECTORY}}/cognatio/web/static/nav/;
	}
}
```