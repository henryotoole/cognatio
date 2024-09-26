# docs/sysadmin.md
# Josh Reed 2024
#
# The following is a guide on how the system must be setup in order to deploy and install cognatio.
# In the future I'll convert this to one of those fancy documents that reads well on github. Until then,
# this will have to do.

### Filesystem ###

# Things to do for this section
1. Check that below is correct
2. Add notes for 'static' (path in nginx config MUST be /static)

# Informal list of all directories that must be nginx-routed
"static"		| /s		| Static repo directory
"local static"	| /sl		| Static local directory
"pages"			| /pages	| Flat directory for pages, unique so as to make URL's and direct editing simple

# Informal list of all directories that user must create
"local"			| Will have /pages, /static, and /etc.

# The Pages Directory #
The pages (or nodes) that actually make up the cognatio system are stored in a flat file structure. These files
can be navigated and read as normal HTML webpages. They sit behind an authentication layer (nginx -> flask) but
are served by nginx. Therefore, nginx must be able to read these files. To keep things flexible, I want to be
able to edit these files at will with any sort of text editor from *within* the server, and from the Navigator
when elsewhere. The most straightforward way to achieve this is to ensure this folder:
1. Is traversable, meaning that execute permissions must exist on every folder up to root.
2. Is readable, meaning that 'others' can read it.
3. Contains only subfiles that are also readable, obviously.

This directory will be setup automatically wherever the config tells it to when cognatio runs, if it does not
already exist. It may not have permission to do this, and will complain about it if so.

It's likely more elegant and correct to do this with something like S3. However, this really is a *personal*
project. I host it on a single machine. Real S3-like services cost money and emulating them on my machine is
just an extra burdern. And most importantly, I like to be able to directly access the files. So nginx+filesystem
it is.

### Backing Services ###
# TODO mysql
# Valkey / Redis #
I happen to be setting this up in the near-wake of the redis disaster. Every able-minded group seems to be in
the process of switching to Valkey, which is convenient as ideologically I agree with the move.

I've built Valkey from source and run it as systemd. However, I use the python 'redis' package as commands for
Valkey and Redis are seemingly identical. Either server should work.

### Logs ###
# TODO structlog

### Config ###
# TODO config paths and searching

### SystemD ###
Recommended service file style:
```conf
[Unit]
Description=Starts/stops the Cognatio server.
After=network.target

[Service]
User=v2r
Group=www-data
RuntimeDirectory=cognatio
WorkingDirectory=/the_root/servers/flask/cognatio/
Environment="PATH=/the_root/servers/venvs/cognatio/bin"
ExecStart=/the_root/servers/venvs/cognatio/bin/gunicorn --workers 3 --bind unix:/run/cognatio/cognatio.sock -m 007 cognatio.web.wsgi:app

[Install]
WantedBy=multi-user.target
```

If manual rotating logs are desired, one can slap | multilog n2 /var/log/cognatio 2>&1 at the end of the ExecStart
command. See https://cr.yp.to/daemontools/multilog.html for some unfathomably based documentation on multilog.

Note the use of a runtime directory that enables workspace at /run/cognatio. Logs could perhaps go in here too.


### RAW STEPS ###
1. Setup a virtualenv for the installation.
2. Install all required packages.
3. Manually install hacutils and dispatch_server with setup.py
4. Choose config location and create.
5. Find directories for static files to live. Create them and link in config.
6. Choose a database name and create the database. (USER WOULD NEED TO INSTALL DB SOFTWARE OF SOME SORT)
7. Choose redis index (USER WOULD NEED TO SETUP VALKEY OR REDIS)
8. Choose secret key and hostname.
9. Create systemd service to start the gunicorn part of the server.
10. Setup NGINX
	a. (USER WOULD NEED TO INSTALL)
	b. Create a cognatio.conf file
	c. Get SSL working (sudo certbot certonly --standalone -d DOMAIN)
	d. Install gunicorn into venv
	e. Create start script.
	
CODE TODO
1. Setup NGINX access to static files.
2. Setup autogeneration of the 'gateway' page.
3. Update remainder of dh_rest with proper error response