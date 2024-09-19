# tests/test_core_model_page.py
# Josh Reed 2024
#
# Test the core Page model.

# Our code
from cognatio.core.models import Page, User, Friend
from cognatio.core.enums import PageAccessMode
from cognatio import cognatio_config, env
from cognatio.util.db import Database

# Other libs

# Base python

def test_read_permissions(test_db: Database):
	"""Test all possible read permissions
	"""
	
	# Add three users
	user1 = User('test1@test.test', 'test1')
	user2 = User('test2@test.test', 'test2')
	user3 = User('test3@test.test', 'test3')
	for user in [user1, user2, user3]:
		test_db.session.add(user)
	test_db.session.flush()
	# User 1 shall be owner
	cognatio_config['OWNER_USER_ID'] = user1.id

	# Add a page
	page = Page(PageAccessMode.PRIVATE)
	test_db.session.add(page)
	test_db.session.flush()
	# And a friend
	friend = Friend(user2.id, page.id)
	test_db.session.add(friend)
	test_db.session.flush()

	# Now we can test the page.

	# 1. Test private mode
	assert page.get_user_read_access(user1.id)
	assert not page.get_user_read_access(user2.id)

	# 2. Test shared mode
	page.read_access_int = PageAccessMode.SHARED.value
	assert page.get_user_read_access(user1.id)
	assert page.get_user_read_access(user2.id)
	assert not page.get_user_read_access(user3.id)

	# 2. Test public mode
	page.read_access_int = PageAccessMode.PUBLIC.value
	assert page.get_user_read_access(user1.id)
	assert page.get_user_read_access(user2.id)
	assert page.get_user_read_access(user3.id)

def test_parse_url_to_name():

	assert Page.parse_url_to_name("http://www.example.com/page/page_name") == "page_name"
	assert Page.parse_url_to_name("http://www.example.com/page/page_name.html") == "page_name"
	assert Page.parse_url_to_name("/page/page_name") == "page_name"
	assert Page.parse_url_to_name("page/page_name") == "page_name"
	assert Page.parse_url_to_name("/page/page_name.html") == "page_name"
	assert Page.parse_url_to_name("/page/page_name/html") == None
	assert Page.parse_url_to_name("/page/page/page_name") == None