"""The root of the cognatio module. This exposes some key toplevel instances, like 'env' and configs.
"""
__author__ = "Josh Reed"

# Our code
from cognatio.core.config import CognatioConfig, CONFIG_DEFAULTS

# Other libs
from hacutils import config, filesys
import structlog

# Base python
import os
import pathlib

version = "1.0.3"

project_path = pathlib.Path(__file__).parent.parent.resolve()
"""This is the root path to the project and/or git repository. It contains cognatio/core, tests, et. al. Unlike
all other paths, this is absolute and does not change for testing.
"""

# Import the config
try:
	cognatio_config: CognatioConfig = config.load_config(config.find_config(project_path, 'cognatio'))
except ValueError as e:
	config.generate_from_defaults("./cognatio.default.cfg", CONFIG_DEFAULTS)
	print(f"A default config file has been placed at {os.path.abspath('./cognatio.default.cfg')}")
	raise
config.defaults_apply(cognatio_config, CONFIG_DEFAULTS)

# Configure the logger
import cognatio.core.logger
logger: structlog.stdlib.BoundLogger = structlog.get_logger()

from cognatio.env import Env
env = Env()

# Checks on module instantiation
from hacutils.nginx import dir_nginx_check_read_accessible
if not os.path.exists(env.fpath_pages):
	filesys.mkdirs(env.fpath_pages, folder=True)
if not os.path.exists(env.fpath_etc):
	filesys.mkdirs(env.fpath_etc, folder=True)
if not os.path.exists(env.fpath_static):
	filesys.mkdirs(env.fpath_static, folder=True)
msg = dir_nginx_check_read_accessible(env.fpath_pages)
if msg is not None:
	logger.warn(msg)
msg = dir_nginx_check_read_accessible(env.fpath_static)
if msg is not None:
	logger.warn(msg)