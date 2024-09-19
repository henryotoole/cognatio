# tests/test_web_schemas.py
# Josh Reed 2024
#
# Test all web schemas.

# Our code
from cognatio.web.schemas import schema_page, schema_user
from tests.conftest import test_db

# Other libs
import pytest

# Base python

def test_page(test_db):
	"""Test the page schema.
	"""

	page1 = schema_page._create({'name': "Page1", 'read_access_int': 0})
	page2 = schema_page._create({'name': "Page2", 'read_access_int': 0})
	page3 = schema_page._create({'read_access_int': 0})
	page4 = schema_page._create({'read_access_int': 0})

	assert schema_page._get(page1['id']) == page1
	assert page3['name'] == "3fff"
	assert page4['name'] == "fffe"

	with pytest.raises(Exception):
		schema_page._update(page2['id'], {'name': 'Alternate'})

	with pytest.raises(Exception):
		schema_page._update(page2['id'], {'id': 111})

	with pytest.raises(Exception):
		schema_page._delete(page2['id'])

def test_user(test_db):
	"""Test the user schema.
	"""

	user1 = schema_user._create({'email': "test@test.test", 'password': "test_password"})

	assert user1 == {'id': 1, 'email': 'test@test.test'}
	