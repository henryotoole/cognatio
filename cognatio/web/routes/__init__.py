"""This module contains ALL routes for cognatio that are not in blueprints. Importing this module will
use current_app to register all routes. 
"""
__author__ = "Josh Reed"

from cognatio.web.routes import login
from cognatio.web.routes import nav
from cognatio.web.routes import misc
from cognatio.web.routes import api_page_resource