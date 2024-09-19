"""
Test the api for 'page resources'
"""
__author__ = "Josh Reed"

# Our code
from cognatio.core.models import Page
from cognatio.core.enums import PageAccessMode
from cognatio.util.db import Database

# Other libs
import pytest

# Base python
import os
import sys
import hashlib
import io


def test_get(spoof_app_context, test_db: Database):
	"""Test the get methods
	"""
	# Must be imported within spoof context
	from cognatio.web.routes import api_page_resource as api

	page = Page(PageAccessMode.PRIVATE, "test_page")
	test_db.session.add(page)
	test_db.session.commit()

	with open(os.path.join(page.page_resource_folder_path, "f1.txt"), 'w+') as ffile:
		ffile.write("CONTENT")
	with open(os.path.join(page.page_resource_folder_path, "f2.txt"), 'w+') as ffile:
		ffile.write("CONTENT")

	assert sorted(api._get_all(page)) == ['f1.txt', 'f2.txt']

def test_create(spoof_app_context, test_db: Database):
	"""Test the create methods
	"""
	# Must be imported within spoof context
	from cognatio.web.routes import api_page_resource as api

	page = Page(PageAccessMode.PRIVATE, "test_page")
	test_db.session.add(page)
	test_db.session.commit()
	
	chunk1 = io.BytesIO("Hello".encode())
	chunk2 = io.BytesIO("World".encode())

	correct_checksum = hashlib.md5("HelloWorld".encode()).hexdigest()
	
	checksum = api._create(page, 'file.txt', chunk2, sys.getsizeof(chunk1))
	api._create(page, 'file.txt', chunk1, 0)

	assert correct_checksum == checksum
	with open(os.path.join(page.page_resource_folder_path, 'file.txt'), 'r') as ffile:
		assert ffile.read() == "HelloWorld"

def test_create(spoof_app_context, test_db: Database):
	
	from cognatio.web.routes import api_page_resource as api
	page = Page(PageAccessMode.PRIVATE, "test_page")
	test_db.session.add(page)
	test_db.session.commit()