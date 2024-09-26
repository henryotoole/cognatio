
cognatio_version := `python -m cognatio version`

# bundle source into output files in bin
bundle:
	esbuild ./cognatio/web/client/navigator/src/nav.js \
		--bundle \
		--outfile=./cognatio/web/client/navigator/bin/nav_{{cognatio_version}}.js \
		--format=esm

# Deploy bundled source into correct destination in the static folder
deploy:
	cp ./cognatio/web/client/navigator/bin/* ./cognatio/web/static/nav/

# run python tests (js tests are in browser only for now)
test:
	pytest -s