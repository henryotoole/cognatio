"""The schema for accessing an edge
"""
__author__ = "Josh Reed"

# Our code
from cognatio.core.models import Edge

# Other libs
from marshmallow import fields
from restlink import SchemaDB

# Base python

class EdgeSchema(SchemaDB):

	_db_model_ = Edge
	_rest_path_ = "/edge"
	_allowed_methods_ = ["GET"]

	# Everything is read only
	id = fields.Int(strict=True, dump_only=True)
	page_id_orig = fields.Int(dump_only=True)
	page_id_term = fields.Int(dump_only=True)
	bond_strength_cached = fields.Int(dump_only=True)

	# Default permissions grant all read and no write access.
	# This is fine.