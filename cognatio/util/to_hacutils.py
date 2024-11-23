"""
To be sent to hacutils later.
"""
__author__ = "Josh Reed"

# Our code

# Other libs

# Base python
from urllib.parse import urlparse
import re

def is_valid_url(url) -> bool:
	"""Determine whether the provided string is a URL. By 'valid url' this function aims to answer whether the
	URL could be used in a browser pointed at a domain to correctly access a resource of some sort. Thus
	relative URL's like /this/that are valid.

	Args:
		url (str): Any string

	Returns:
		bool: True if valid, False if not.
	"""
	if len(url) == 0: return False
	has_illegal = re.search('[^]A-Za-z0-9_.~!*''();:@&=+$,/?#[%-]+', url) is not None
	if has_illegal: return False
	try:
		result = urlparse(url)
		return True
	except ValueError:
		return False