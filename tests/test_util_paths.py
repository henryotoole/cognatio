"""
Test paths util functions
"""
__author__ = "Josh Reed"

# Our code
from cognatio.util import paths

# Other libs
import pytest

# Base python

def test_get_page_name_from_url():

	assert paths.get_page_name_from_url("http://www.example.com/page/target") == 'target'
	assert paths.get_page_name_from_url("http://www.example.com/page/target.html") == 'target'
	assert paths.get_page_name_from_url("http://www.example.com/page/target/resource/thing.ext") == 'target'