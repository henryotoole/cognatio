# Development Notes #


# Update Release Steps #
1. Create new branch off of master with name version_$version
2. Work in that branch to develop update.
	+ Increment version number in cognatio.__init__.version
	+ Alter references to nav.js version number in web/static/js (page_tap.js)
3. Run tests
4. Merge back into master