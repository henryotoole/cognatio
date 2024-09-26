"""
Contains utilities relating to paths that are unique to cognatio
"""

__author__ = "Josh Reed"

# Our code

# Other libs

# Base python
from pathlib import Path
from urllib.parse import urlparse

def get_page_name_from_url(url):
	"""Given a url that can take the provided forms:
	'$domain/page/target.html'
	'$domain/page/target'
	'$domain/page/target/*'

	Discern the page name that the request would fall under

	Args:
		url (str): Provided url

	Returns:
		str: The page name or None if it can not be determined.
	"""
	o = urlparse(url)
	bits = o.path.split('/')

	if(len(bits) > 3):
		return bits[2]
	else:
		path = Path(o.path)
		return path.stem