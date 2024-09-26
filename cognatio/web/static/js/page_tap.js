/**
 * @file This file is loaded with every page that comes down from the server. It's responsible for setting
 * 		 up the listener for the keypresses that launch the navigator around a page.
 * @author Josh Reed
 */

// Use an IIFE to prevent pollution of global scope.
(() => {

	// TODO REST OF THIS!
	// Must inject css
	// Must inject loading pane
	// etc etc

	import("/static/js/nav_1.0.0.js").then(()=>
	{
		console.log("Loaded static js")
	})

})()