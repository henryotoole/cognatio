
cognatio_version := `python -m cognatio version`
client_nav := "./cognatio/web/client/navigator"
web_static := "./cognatio/web/static"

# bundle source into output files in bin
bundle:
	esbuild {{client_nav}}/src/nav.js \
		--bundle \
		--outfile={{client_nav}}/bin/nav_{{cognatio_version}}.js \
		--format=esm
	cp -R {{client_nav}}/bin/nav_{{cognatio_version}}.js {{client_nav}}/bin/nav.js

# Deploy bundled source into correct destination in the static folder
deploy:
	cp -R {{client_nav}}/bin/* {{web_static}}/nav/src/
	cp -R {{client_nav}}/assets/* {{web_static}}/nav/assets/
	cp -R {{client_nav}}/scripts/* {{web_static}}/nav/scripts/

# run python tests (js tests are in browser only for now)
test:
	pytest -s