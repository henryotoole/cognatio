# tests/test_util_schema.py
# Josh Reed 2024
#
# Tests for the custom SchemaRSA class.

# Our code
from cognatio.util.dr_hitch.schema_rsa import SchemaRSA
from cognatio.core.models import Base
from cognatio import env
from tests.conftest import test_db

# Other libs
import pytest
from marshmallow import fields, validate, post_load
from werkzeug.exceptions import HTTPException
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String

# Base python


class SampleModel(Base):

	__tablename__ = "sample"

	id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
	name: Mapped[str] = mapped_column(String(64), nullable=True)
	readonly: Mapped[str] = mapped_column(String(64), nullable=True)
	excluded: Mapped[str] = mapped_column(String(64), nullable=True)

	def __init__(self, name):
		self.name = name
		self.readonly = "readonly"
		self.excluded = "Not for consumption by frontends."

class SampleSchemaRSA(SchemaRSA):

	id = fields.Int(strict=True)
	name = fields.String(validate=validate.Length(min=1, max=64))
	readonly = fields.String(dump_only=True)
	excluded = fields.String()

	__db_model__ = SampleModel

	@post_load
	def make_rec(self, data: dict, **kwargs) -> SampleModel:
		"""Very simply makes the record instance and adds to DB
		"""
		rec = SampleModel(data['name'])
		env.db.session.add(rec)
		env.db.session.flush()
		return rec
	
	def validate_can_read(self, id, accessor_identity) -> bool:
		return True
	
	def validate_can_write(self, id, accessor_identity) -> bool:
		return True

@pytest.fixture
def schema():
	return SampleSchemaRSA(exclude=["excluded"])

def test_schema_exceptions(schema: SampleSchemaRSA, test_db):
	"""Test all exception transfer behavior for validation failures, etc.
	"""

	good_data = {'name': "Good Name"}
	bad_data = {'name': ""}

	# Validate is altered
	schema.validate(good_data)

	with pytest.raises(HTTPException) as exc:
		schema.validate(bad_data)

	# Load is altered
	schema.load(good_data)

	with pytest.raises(HTTPException) as exc:
		schema.load(bad_data)

def test_schema_default_ops(schema: SampleSchemaRSA, test_db):
	"""Test the basic get/create/update/delete functions of the RSA schema
	"""

	created = schema._create({'name': 's1'})

	getted = schema._get(created['id'])

	target = {'id': 1, 'name': 's1', 'readonly': 'readonly'}
	# Note that 'excluded' is NOT shown here.

	assert created == getted
	assert created == target

	updated = schema._update(created['id'], {'name': 'newname'})
	getted = schema._get(created['id'])
	assert updated['name'] == 'newname'
	assert getted == updated

	with pytest.raises(Exception):
		schema._update(created['id'], {'readonly': 'notorig'})

	schema._create({'name': 's2'})
	schema._create({'name': 's3'})
	schema._create({'name': 's4'})

	assert schema._get_list() == [1, 2, 3, 4]

def test_schema_list_filtering(schema: SampleSchemaRSA, test_db):
	"""Test the list filtering automatic behavior.
	"""
	schema._create({'name': 's1'})
	schema._create({'name': 's2'})
	schema._create({'name': 's3'})
	schema._create({'name': 's4'})

	assert schema._get_list() == [1, 2, 3, 4]

	# Null case
	schema._get_list({}) == [1, 2, 3, 4]

	# One param
	schema._get_list({'name': 's1'}) == [1]
	# Two params
	schema._get_list({'name': 's1', 'readonly': 'readonly'}) == [1]
	# Invalid param
	with pytest.raises(HTTPException):
		schema._get_list({'nonexist': 's1'}) == [1]
	# Illegal param
	with pytest.raises(HTTPException):
		schema._get_list({'excluded': 'anything'}) == [1]