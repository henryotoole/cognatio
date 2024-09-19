"""
The parser that cognatio uses to assess the connections between different Pages.
"""
__author__ = "Josh Reed"

# Our code
from cognatio import cognatio_config
from cognatio.core.models import Page
from cognatio.util.to_hacutils import is_valid_url

# Other libs

# Base python
from html.parser import HTMLParser
from urllib.parse import urlparse
from typing import TypedDict

class Link(TypedDict):
	url: str
	strength: int
	internal: bool
	page_name: str

class CognatioParser(HTMLParser):

	def handle_starttag(self, tag: str, attrs: dict):
		"""Extends an abstract hook. See super method docs for more info.
		
		Args:
			tag (str): The tag that was detected. Always lowercase
			attrs (list): List of name to value of attributes
		"""
		attrs_dict = {}
		for k, v in attrs:
			attrs_dict[k] = v

		if(tag == 'a' or tag == 'link') and 'href' in attrs_dict:

			link = attrs_dict['href']
			valid, internal, page_name = CognatioParser.evaluate_link(link)

			if not valid:
				return

			strength = 1
			try:
				strength = int(attrs_dict['strength'])
				strength = max(1, min(5, strength))
			except:
				pass

			self._links.append({
				'url': link,
				'strength': strength,
				'internal': internal,
				'page_name': page_name
			})

	@staticmethod
	def evaluate_link(link: str) -> tuple:
		"""Evaluate the provided link. Links can be literally anything as they are technically user input, so
		anything can be expected here. This function determines:
		1. Is the URL actually valid? No illegal chars, etc.
		2. Is the URL internal? If fired into a web browser from within cognation's domain would it reflect
		   back on the domain?
		3. Does the URL point to a valid page or not? Other internal resources will not count as pages. Note
		   that it will not actually assert the existence of a page, just that the format is correct.

		Args:
			link (str): The link to evaluate.

		Returns:
			tuple: is_valid, page_name (or None)
		"""
		valid = is_valid_url(link)

		if not valid:
			return False, False, None

		result = urlparse(link)
		# If it's relative, or absolute at our hostname, it's internal.
		internal = result.hostname == None or cognatio_config['WEB_HOSTNAME'] == result.hostname

		if not internal:
			return True, False, None

		# And then check if it's a valid page.
		page_name = Page.parse_url_to_name(link)
		return True, True, page_name

	def reset(self):
		""""Reset the instance". This is always called on instantiation, and may be called again later.

		Extended here to reset variables into which info is parsed.
		"""
		super().reset()
		self._links = []

	@property
	def links(self) -> 'list[Link]':
		return self._links