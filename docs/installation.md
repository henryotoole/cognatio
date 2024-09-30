# docs/installation.md
# Josh Reed 2024
#
# Installation instructions that are sure to frustrate.

### Foreword ###
Cognatio is very much a personal project. I'm not certain that others besides those I know personally will ever set up their own cognatio installations. The following guide is informal and will require good GNU skills and possibly some debugging.

In the future, I'd love to return to this project from a sysadmin point of view and create a package that's easy to install and maintain.

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
    1. Install nginx onto the system.
    2. Create a conf file for the cognatio nginx blocks.
    3. Run letsencrypt commands to setup ssl for this domain
15. Start the systemctl service for cognatio.