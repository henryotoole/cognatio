"""
Tests that should be moved to HACutils later.
"""

# Our code
from cognatio.util.to_hacutils import is_valid_url

# Other libs

# Base python


def test_is_valid_url():

	assert is_valid_url("http://hello.com/url.ext")
	assert is_valid_url("http://hello.com/url")
	assert is_valid_url("http://hello.com/url/")
	assert is_valid_url("https://hello.com/url/")
	assert is_valid_url("hello.com/url/")
	assert is_valid_url("www.hello.com/url/")
	assert is_valid_url("/this")
	assert is_valid_url("/this/that")

	assert not is_valid_url("www.hello.com/url/with space.html")
	assert not is_valid_url("C:\\")
	assert not is_valid_url("/normal/" + chr(1081))