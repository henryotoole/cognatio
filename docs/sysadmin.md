# docs/sysadmin.md
# Josh Reed 2024
#
# The following is a guide on how the system must be setup in order to deploy and install cognatio.
# In the future I'll convert this to one of those fancy documents that reads well on github. Until then,
# this will have to do.

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

# Informal list of all directories that must be nginx-routed
"static"		| /s		| Static repo directory
"local static"	| /sl		| Static local directory
"pages"			| /pages	| Flat directory for pages, unique so as to make URL's and direct editing simple
"nav_reroute"	| /nav/*	| Redirect to /s/nav/* with NGINX

# Informal list of all directories that user must create
"local"			| Will have /pages, /static, and /etc.

# The Local Directory #
All files which are generated during the use of cognatio are considered local. A directory must be made on the installation machine which contains these files. This includes pages, local static files, and others.

The path to the directory for these files is specified in cognatio.cfg under the "FPATH_LOCAL" key.

Two of the subdirectories under local will need to be exposed to the world via nginx. This means that the local directory must be:
1. Traversable, meaning that execute permissions for nginx must exist on every folder up to root.
2. Readable, meaning that nginx can read files within.

This may be achieved by giving 'others' execute permissions all the way up to root, and 'others' read permissions on all files within local. More complex arrangements can be made if the nginx group is placed on the files, of course.

# The Pages Local Subdirectory #
The pages (or nodes) that actually make up the cognatio system are stored in a flat file structure. These files can be navigated and read as normal HTML webpages. They sit behind an authentication layer (nginx -> flask) but are served by nginx.

This directory will be setup automatically wherever the config tells it to when cognatio runs, if it does not already exist. It may not have permission to do this, and will complain about it if so.

# The Static Local Subdirectory #
A static directory will also be automatically setup when cognatio runs. This is a location to place shared resources like icons, css files, scripts, etc. that are written uniquely for the cognatio installation. Not to be confused with the cognatio code's internal 'static' directory, which serves non-unique static files. 

### Backing Services ###

# Valkey / Redis #
I happen to be setting this up in the near-wake of the redis disaster. Every able-minded group seems to be in the process of switching to Valkey, which is convenient as ideologically I agree with the move.

I've built Valkey from source and run it as systemd. However, I use the python 'redis' package as commands for Valkey and Redis are seemingly identical. Either server should work.

# SQL #
An SQL server will need to be available. Any should do, and the access URI shall be specified in cognatio.cfg.

### Logs ###
With logs I follow the doctrine spelled out here: https://12factor.net/logs. This means that all logs are sent
to stdout and stderr. For production installations, I recommend using systemd and allowing logs to hit journalctl.

However, if manual rotating logs are desired, one can slap | multilog n2 /var/log/cognatio 2>&1 at the end of the ExecStart command in the systemd service file. See https://cr.yp.to/daemontools/multilog.html for some unfathomably based documentation on multilog.

Note the use of a runtime directory that enables workspace at /run/cognatio. Logs could perhaps go in here too.

### Config ###
# TODO document nature of config paths and create a way to generate config.

### SystemD ###
Recommended service file style:
```conf
[Unit]
Description=Starts/stops the Cognatio server.
After=network.target

[Service]
User=$DESIRED_USERNAME
Group=$DESIRED_GROUP
RuntimeDirectory=cognatio
WorkingDirectory=/the_root/servers/flask/cognatio/
Environment="PATH=/the_root/servers/venvs/cognatio/bin"
ExecStart=/the_root/servers/venvs/cognatio/bin/gunicorn --workers 3 --bind unix:/run/cognatio/cognatio.sock -m 007 cognatio.web.wsgi:app

[Install]
WantedBy=multi-user.target
```

### Nginx ###
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

	location / {
		include /the_root/servers/nginx/common_blocks/cache_dynamic;
		include proxy_params;
		proxy_pass http://unix:/run/cognatio/cognatio.sock;
		# Required for /static/private. Yes, it must go in this block for some reason.
		# TODO re-investigate this.
		proxy_set_header X-Original-URI $request_uri;
	}
}
```

### Complete Installation Instructions ###
1. Choose a location for cognatio's source code to live.
2. Clone the cognatio repo into that directory.
3. Clone the hacutils repo (https://github.com/henryotoole/hacutils).
4. Clone the dispatch_server repo (https://github.com/henryotoole/dispatch_server).
5. Setup a python virtual environment (e.g. `python -m venv ./venv`). Activate the venv (`source ./venv/bin/activate`).
6. `cd` into hacutils and dispatch_server and install them both to the venv by running `setup.py install`.
7. `cd` into cognatio and install the rest of the required python libs with `pip install -r ./requirments.txt`.
8. Choose where you wish the config file to live for this installation (see the config section above). Run cognatio once to generate a default config file in the repo base directory via `python -m cognatio dev flask`. Move this config file to the desired location and fill in the "MUST_BE_MANUALLY_DEFINED" values as you follow the below steps.
9. Choose a location for the 'local' directory. Ensure that, for nginx, the directory has execute permissions all the way up to root and read permissions on the directory itself. Record the absolute path to this directory in cognatio.cfg "FPATH_LOCAL".
10. Install an SQL server of some sort and create a database for cognatio. Place the resulting db access URI in cognatio.cfg "DB_URI".
11. Setup either redis or valkey and record the access url to cognatio.cfg "REDIS_URL".
12. Fill in the "FLASK_SECRET_KEY" and "WEB_HOSTNAME" values in cognatio.cfg. The secret key should be a long (>32chars), random string and the web hostname will be the hostname at which the server will broadcast (e.g. cognatio.theroot.tech).
13. Create a systemd service to operate the server. See the SystemD section for a sample service file.
14. Setup nginx.
	a. Install nginx onto the system.
	b. Create a conf file for the cognatio nginx blocks.
	c. TODO rest of this