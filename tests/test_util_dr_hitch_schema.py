"""
Basic tests for the base SchemaREST
"""
__author__ = "Josh Reed"

# Our code
from cognatio import env
from cognatio.util.dr_hitch import SchemaREST
from cognatio.util.db import Database
from cognatio.core.models import Base

# Other libs
import pytest
from marshmallow import fields, validate, post_load
from werkzeug.exceptions import HTTPException
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String

# Base python



class SampleModel(Base):

	__tablename__ = "sample2"

	id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
	name: Mapped[str] = mapped_column(String(64), nullable=True)
	readonly: Mapped[str] = mapped_column(String(64), nullable=True)
	excluded: Mapped[str] = mapped_column(String(64), nullable=True)

	def __init__(self, name):
		self.name = name
		self.readonly = "readonly"
		self.excluded = "Not for consumption by frontends."

class SampleSchema(SchemaREST):

	id = fields.Int(strict=True)
	name = fields.String(validate=validate.Length(min=1, max=64))

	@post_load
	def make_rec(self, data: dict, **kwargs) -> SampleModel:
		"""Very simply makes the record instance and adds to DB
		"""
		rec = SampleModel(data['name'])
		env.db.session.add(rec)
		env.db.session.flush()
		return rec
	
	def validate_can_read(self, id, accessor_identity) -> bool:
		return accessor_identity == "reads"
	
	def validate_can_write(self, id, accessor_identity) -> bool:
		return accessor_identity == "writes"


def test_accessor_validation(test_db: Database):
	"""Test that the accessor is validated read / write.
	"""

	schema = SampleSchema()

	# Neither behavior: can do nothing
	with pytest.raises(HTTPException):
		schema.get(1, "neither")
	with pytest.raises(HTTPException):
		schema.post({}, "neither")
	with pytest.raises(HTTPException):
		schema.put(1, {}, "neither")
	with pytest.raises(HTTPException):
		schema.delete(1, "neither")

	# Read behavior: can do GET
	schema.get(1, "reads")
	with pytest.raises(HTTPException):
		schema.post({}, "reads")
	with pytest.raises(HTTPException):
		schema.put(1, {}, "reads")
	with pytest.raises(HTTPException):
		schema.delete(1, "reads")

	# Write behavior: can do POST PUT DELETE
	with pytest.raises(HTTPException):
		schema.get(1, "writes")
	schema.post({}, "writes")
	schema.put(1, {}, "writes")
	schema.delete(1, "writes")