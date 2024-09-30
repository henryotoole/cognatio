/**
 * @file This file is loaded with every page that comes down from the server. It's responsible for setting
 * 		 up the listener for the keypresses that launch the navigator around a page.
 * @author Josh Reed
 */

// Use an IIFE to prevent pollution of global scope.
(() => {

	const memspace = {
		has_activated: false
	}

	import("/nav/src/nav.js").then((module)=>
	{
		// No linting here, yet.
		memspace.nav = module
		bind_keys()
	})

	/**
	 * Bind the keypress that activates the navigator 'around' this webpage.
	 */
	let bind_keys = ()=>
	{
		document.addEventListener('keydown', (e)=>
		{
			if(memspace.has_activated) return
			if(e.ctrlKey && e.altKey && e.code == "KeyC")
			{
				memspace.has_activated = true
				nav_redirect()
			}
		})
	}

	/**
	 * Redirect to the navigator, primed for the original page.
	 */
	let nav_redirect = ()=>
	{
		// Infer page from location
		let dirname = '/pages/',
			path = String(window.location.pathname),
			i_html = path.indexOf(".html"),
			name = path.substring(path.indexOf(dirname) + dirname.length, i_html > 0 ? i_html : undefined)
		window.location = "/nav#" + name
	}

})()