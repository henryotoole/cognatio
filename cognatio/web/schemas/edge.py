"""The schema for accessing an edge
"""
__author__ = "Josh Reed"

# Our code
from cognatio.util.dr_hitch.schema_rsa import SchemaRSA
from cognatio.core.models import Edge

# Other libs
from marshmallow import fields

# Base python

class EdgeSchema(SchemaRSA):

	__db_model__ = Edge
	__rest_path__ = "/edge"
	__allowed_methods__ = ["GET"]

	# Everything is read only
	id = fields.Int(strict=True, dump_only=True)
	page_id_orig = fields.Int(dump_only=True)
	page_id_term = fields.Int(dump_only=True)
	bond_strength_cached = fields.Int(dump_only=True)

	# Default permissions grant all read and no write access.
	# This is fine.