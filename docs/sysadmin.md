# docs/sysadmin.md
# Josh Reed 2024
#
# The following is a guide on how the system must be setup in order to deploy and install cognatio.
# In the future I'll convert this to one of those fancy documents that reads well on github. Until then,
# this will have to do.

### Filesystem ###

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