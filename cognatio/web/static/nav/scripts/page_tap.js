/**
 * @file This file is loaded with every page that comes down from the server. It's responsible for setting
 * 		 up the listener for the keypresses that launch the navigator around a page.
 * @author Josh Reed
 */

// Use an IIFE to prevent pollution of global scope.
(() => {

	const memspace = {
		has_activated: false,
		gesture: undefined
	}

	// No need for this under the current redirect paradigm.
	//import("/nav/src/nav.js").then((module)=>
	//{
	//	// No linting here, yet.
	//	memspace.nav = module
	//})
	let init = ()=>
	{	
		bind_keys()
		bind_gesture()
		set_title()
	}

	/**
	 * Bind the touch events that activates (or deactivates) tne navigator 'around' this webpage (on desktop)
	 * 
	 * NOTE that this hotkey code is mirrored within the navigator's codebase as well for switching back.
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
	 * Bind the touch events that activates (or deactivates) tne navigator 'around' this webpage (on mobile).
	 * 
	 * This 'gesture' is three fingers dragging across the screen from left to right.
	 * 
	 * NOTE that this gesture code is mirrored within the navigator's codebase as well for switching back.
	 */
	let bind_gesture = ()=>
	{
		/**
		 * Called when the gesture is started with three touches.
		 * @param {TouchEvent} e 
		 */
		let gesture_start = (e)=>
		{
			memspace.gesture = {
				'touches_start': {},
				'touches_last': {}
			}
			for(let i = 0; i < e.touches.length; i++)
			{
				let ident = e.touches[i].identifier
				memspace.gesture.touches_start[e.touches[i].identifier] = {
					x: e.touches[i].clientX,
					y: e.touches[i].clientY,
				}
				memspace.gesture.touches_start[ident] = {
					x: e.touches[i].clientX,
					y: e.touches[i].clientY,
				}
			}
		}

		/**
		 * Called every time the touch list updates. Only called if there are exaclty three touches.
		 * @param {Touchlist} touches 
		 */
		let gesture_update = (touches)=>
		{
			// Update coords
			for(let i = 0; i < touches.length; i++)
			{
				memspace.gesture.touches_last[touches[i].identifier] = {
					x: touches[i].clientX,
					y: touches[i].clientY,
				}
			}
		}

		let gesture_end = ()=>
		{
			if(memspace.gesture != undefined)
			{
				// Check to see if gesture was performed.
				let gesture_drags = 0
				Object.entries(memspace.gesture.touches_start).forEach(([ident, coords_start])=>
				{
					let coords_last = memspace.gesture.touches_last[ident]
					let pctx_travelled = (coords_last.x - coords_start.x) / window.innerWidth
					let pcty_travelled = (coords_last.y - coords_start.y) / window.innerWidth

					if(pctx_travelled > 0.5 && pcty_travelled < 0.5)
					{
						gesture_drags += 1
					}
				})
				memspace.gesture = undefined

				if(gesture_drags == 3)
				{
					nav_redirect()
				}
			}
		}

		document.addEventListener('touchmove', (e)=>
		{
			if(e.touches.length != 3)
			{
				gesture_end()
				return
			}

			if(memspace.gesture == undefined)
			{
				gesture_start(e)
			}
			else
			{
				gesture_update(e.touches)
			}
		})

		document.addEventListener('touchend', (e)=>
		{
			gesture_end()
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

	/**
	 * Set the title of this page if it was not already set.
	 */
	let set_title = ()=>
	{
		if(document.title.length == 0)
		{
			let bits = window.location.pathname.split("/"),
				fname = bits[bits.length - 1],
				hname = fname.split(".")[0]
			document.title = hname
		}
	}

	init()

})()