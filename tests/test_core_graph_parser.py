"""
Tests for the CognatioParser
"""
__author__ = "Josh Reed"

# Our code
from cognatio import cognatio_config
from cognatio.core.graph import CognatioParser

# Other libs

# Base python

def test_url_eval():

	hn = cognatio_config["WEB_HOSTNAME"]

	assert CognatioParser.evaluate_link("http://www.ex.com/good/ext") == (True, False, None)
	assert CognatioParser.evaluate_link("http://www.ex.com/ba d/ext") == (False, False, None)

	assert CognatioParser.evaluate_link(f"http://{hn}/good/internal") == (True, True, None)
	assert CognatioParser.evaluate_link("/good/internal") == (True, True, None)

	assert CognatioParser.evaluate_link("/page/page_name") == (True, True, "page_name")
	assert CognatioParser.evaluate_link(f"http://{hn}/page/page_name") == (True, True, "page_name")

def test_parse_links():

	html = '''
	<html><body>
		<div>
			<a href='/page/page_name'> Bo! </a>
			<a href='/this/that' strength=2>
				<div> Stuff </div>
			</a>
			<a href='/page/page_name' strength="bbb">  </a>
		</div>
	</body></html>
	'''
	parser = CognatioParser()
	parser.feed(html)
	assert parser.links[0]["url"] == '/page/page_name'
	assert parser.links[0]["strength"] == 1
	assert parser.links[1]["url"] == '/this/that'
	assert parser.links[1]["strength"] == 2
	assert parser.links[2]["strength"] == 1