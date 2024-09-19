"""
Module file for all models. Helps with import order.
"""
__author__ = "Josh Reed"

# Our code

# Other libs
from sqlalchemy.orm import DeclarativeBase

# Base python

# Setup our declarative base
class Base(DeclarativeBase):
	pass

from cognatio.core.models.friend import Friend
from cognatio.core.models.page import Page
from cognatio.core.models.user import User
from cognatio.core.models.edge import Edge