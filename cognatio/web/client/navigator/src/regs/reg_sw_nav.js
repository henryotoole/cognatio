/**
 * @file The toplevel switchyard class for the navigator.
 * @author Josh Reed
 */

import {RegionSwitchyard, Fabricator, RHElement, DHREST, ErrorREST} from "../lib/regional.js";
import {
	DHPage,
	DHPageContent,
	DHPageResource,
	DHEdge,
	DHFriend,
	RegCoords,
	RegNewPage,
	RegControls,
	RegMap,
	RegEditor,
	RegAlterPage,
	CompPage,
	RegOneChoiceNav,
	RegTwoChoiceNav,
	RegResources,
	RegResourceNew,
	RegLoading,
	RegLogin,
	url_is_internal,
	url_to_page_name,
} from "../nav.js";


/**
 * Central Switchyard for the Cognatio Navigator.
 * 
 * **On Structure**
 * The goal of the cognatio regional application is to be completely independent of the base HTML. This
 * will ensure that the code can be loaded either into a dedicated page (e.g. nav.html) for navigation or into
 * some cognatio 'Page' (e.g. /pages/topic.html) to be activated at the press of a key.
 */
class RegSWNav extends RegionSwitchyard
{
	constructor()
	{
		super()
		this.dispatch_config.load_functions = 1
		//this.dispatch_config.verbose = true
		this.default_page_name = 'gateway'
	}

	fab_get()
	{
		// Note that the toplevel nesting selector matches attribute rfm_reg="RegSWNav". This attribute is
		// automatically added to regions' reg element when they are linked.
		let css = /* css */`

			[rfm_reg="RegSWNav"] {

				/* The 'parent' class here is the <body> */
				overflow: hidden;

				/* This sits at the very top level to intercept scrolling so the whole window doesn't scroll,
				which ruines the ethereal behaviors. */
				& .cont-scroll {
					width: 100vw;
					height: 100vh;
					overflow: auto;
				}
				/* The master container for the navigator. One level below the 'scrolling' container */
				& .cont-master {
					width: 100vw;
					display: flex;
					flex-direction: column;
					align-items: flex-start;
					justify-content: center;
				}
				/* The main split container that holds the viewport, editor, controls and coords */
				& .cont-split {
					box-sizing: border-box;
					width: 100vw; height: 100vh;
					display: flex;
					flex-direction: row;
					overflow: hidden;
					position: relative; /* Needed so that abs-pos children will clip out correctly. */
				}
				/* A small container for the controls in the top left. Bound to cont-split, not browser viewport */
				& .cont-controls {
					position: absolute;
					top: 0; left: 0;
					/* Width / height set by content within */
					display: flex;
					flex-direction: column;
					pointer-events: none;
				}
				/* A small container for the coords in the bottom left. Bound to cont-split, not browser viewport */
				& .cont-coords {
					position: absolute;
					bottom: 0; left: 0;
				}
				/* Main container in cont-split to hold the navigator map region */
				& .cont-map {
					height: 100%;
					width: 100%; /* Width is managed more specifically by region machinery */
					border: 1px dashed grey;

					transition: 0.5s;
				}
				/* Main container in cont-split to hold the navigator editor region */
				& .cont-editor {
					position: absolute;
					height: 100%;
					width: 100%; /* Width is managed more specifically by region machinery */
					
					transition: 0.5s;
				}
				/* Container for the resources region, not shown by default. */
				& .cont-resources {
					width: 100%;
					min-height: 20em; /* Max height is set on cont-scrolling within RegResources */
					display: inherit;
				}
			}
		`
		let css_body = /* css */ `
			body {margin: 0px}
		`
		let html = /* html */`
		<div rfm_member='cont_scroll' class='cont-scroll'>
			<div rfm_member='cont_master' class='cont-master'>
				<div class='cont-split'>
					<div rfm_member='cont_map' class='cont-map'></div>
					<div rfm_member='cont_editor' class='cont-editor'></div>
					<div rfm_member='cont_controls' class='cont-controls'></div>
					<div rfm_member='cont_coords' class='cont-coords'></div>
				</div>
				<div rfm_member='cont_resources' class='cont-resources' style='display: none'></div>
			</div>
		</div>
		`
		return new Fabricator(html).add_css_rule(css).add_css_rule(css_body)
	}

	/** @description Settings object for this region. This is local data which is erased on page refresh. */
	settings = {
		/** @description The current app-side page that is selected for viewing. Undefined is valid. */
		page_id: undefined,
		/** @description Whether or not the editor pane should be shown presently */
		show_editor: undefined,
		/** @description Whether or not the resources pane should be shown presently */
		show_resources: undefined,
		/** @description The width that the editor should take, of the overall page, as decimal percent */
		editor_width: undefined,
		/** @description Whether or not the map is enabled. If enabled, files and editor are disabled. */
		map_enabled: undefined,
		/** @description True when a page is actively loading in. Referenced by many child regions.*/
		page_loading: undefined,
		/** @description The hash that was last used to set a page */
		last_hash: undefined,
		/** @description The presets that are available when creating a new page. keys to names. */
		presets: {},
		/** @description The presets that are available when creating a new page. keys to rel url's. */
		preset_urls: {},
		/** @description A memory space used by gesture tracking. */
		gesture: {},
	}

	/** @type {RHElement} */
	cont_scroll
	/** @type {RHElement} */
	cont_master
	/** @type {RHElement} */
	cont_map
	/** @type {RHElement} */
	cont_editor
	/** @type {RHElement} */
	cont_resources
	/** @type {RegCoords} */
	reg_coords
	/** @type {RegNewPage} */
	reg_page_new
	/** @type {RegAlterPage} */
	reg_page_alter
	/** @type {RegTwoChoiceNav} */
	reg_two_choice
	/** @type {RegOneChoiceNav} */
	reg_one_choice
	/** @type {RegControls} */
	reg_controls
	/** @type {RegMap} */
	reg_map
	/** @type {RegEditor} */
	reg_editor
	/** @type {RegResources} */
	reg_resources
	/** @type {RegResourceNew} */
	reg_resource_new
	/** @type {RegLogin} */
	reg_login
	/** @type {DHPage} */
	dh_page
	/** @type {DHPageContent} */
	dh_page_content
	/** @type {DHPageResource} */
	dh_page_resource
	/** @type {DHEdge} */
	dh_edge

	/**
	 * Navigate to a page by URL. This ultimately calls page_nav() and page_set(), but only after resolving this
	 * URL as an internal page that actually exists.
	 * 
	 * @param {String} url The URL of the page to navigate to.
	 * 
	 * @returns {Promise} That resolves when the page is set and loaded or rejects if something is or goes wrong.
	 */
	async page_nav_url(url)
	{
		// Perform checks on URL.
		if(!url_is_internal(url))
		{
			let err = new Error("Currently navigator does not support non-internal URL's.")
			err._non_internal = true
			throw err
		}
		let page_name = url_to_page_name(url)
		if(page_name == undefined) throw new Error(`Url '${url}' can not be parsed to page name.`)

		return this.swyd.dh_page.list({'name': page_name}).then((ids)=>
		{
			if(ids.length == 0)
			{
				let e = new Error(`Page '${page_name}' does not exist.`)
				e._nonexist = true
				e._page_name = page_name
				throw e
			}
			return this.swyd.page_nav(ids[0])
		})
	}

	/**
	 * 'Navigate' to a page by ID. This differs from page_set in that it adds certain ergonomic checks that
	 * might call for user input, such as an 'unsaved changes, are you sure?' type event.
	 * 
	 * @param {Number} id The ID of the page to navigate gracefully to.
	 */
	async page_nav(id)
	{
		let promise_unsaved = Promise.resolve()
		if(this.swyd.reg_editor.has_unsaved_changes)
		{
			promise_unsaved = this.swyd.reg_two_choice.present_choice(
				"Unsaved Changes",
				"There are changes in the editor that have not been pushed to the server. These changes " +
				"will be lost if the Navigator jumps to a new page. Are you sure you wish to proceed?",
				"No",
				"Yes"
			)
		}
		return promise_unsaved.then(()=>
		{
			return this.page_set(id)
		})
	}

	/**
	 * Set the page that all regions are pointing at. This handles all the complexity of loading a new page:
	 * + Ensuring all needed datahandlers have correct, up-to-date data
	 * + Handling master loading state
	 * + Propagating proper errors in the event that predictable errors occur (like lack of authentication)
	 * + Handling the null-case (e.g. nothing selected)
	 * 
	 * @param {Number} id The ID of the page to select or undefined to unload all.
	 * @param {Boolean} prevent_rollback If true, do not roll back to previous ID if load fails.
	 * 
	 * @returns {Promise} A promise that resolves when the new page has been selected and all resources loaded.
	 */
	async page_set(id, prevent_rollback)
	{
		let prev_id = this.settings.page_id
		this.settings.page_loading = true

		if(id == undefined)
		{
			throw "ID was undefined - reset all page tracking DH's and regions."
		}

		// Absolute first thing we do is track the ID in the page resource. This will trigger an auth failure
		// if user has no access and we want that first so as to interrupt state as little as possible.
		this.dh_page_resource.current_page_set(id)

		let wait = new Promise((res, rej)=>
		{
			window.setTimeout(()=>{res()}, 1000)
		})

		let page
		return this.dh_page_resource.track_all().catch((e)=>
		{
			// This is the first place in the chain which will fail due to authentication if the user
			// does not have access to the requested page. Handling for such an event is done here
			// and will not propagate up to the general chain catch() below.
			if(e instanceof ErrorREST && e.data.http_code == 403)
			{
				let prom
				if(this.settings.user_id == undefined)
				{
					// Prevents re-loading of this very twochoice when the error is thrown.
					prevent_rollback = true
					prom = this.reg_two_choice.present_choice(
						"Page Access Not Authorized",
						"This page requires authorization to view, and you are not logged into an account. " +
						"Would you like to sign in?",
						"Go Back",
						"Log In"
					).then(()=>
					{
						this.reg_login.activate()
						this.reg_login.set_callback(()=>
						{
							this.page_set(id, prevent_rollback)
						})
					}).catch(()=>
					{
						this.page_set(prev_id, true)
					})
				}
				else
				{
					prom = this.reg_one_choice.present_message(
						"Page Access Not Authorized",
						"Your user account is not authorized to view this page."
					)
				}
				return prom.finally(()=>{throw("Interrupt then chain.")})
			}
			throw(e) // Shorthand for 'else'
		})
		.then(()=>
		{
			this.dh_page.track_ids([id])
			return this.dh_page.pull()
		})
		.then(()=>
		{
			// Mass-change settings to new page, now that we certainly have access to it and know about it.
			this.settings.page_id = id
			page = this.dh_page.comp_get(id)
			this.dh_page_content.track(id, page.page_url)
			this.reg_coords.settings.local_page_name = page.name

		})
		.then(()=>
		{
			return this.dh_page_resource.pull()
		})
		.then(()=>
		{
			// Prep the app-side source for selected page content. Cache works if ID has not changed.
			return this.dh_page_content.pull()
		})
		.then(()=>
		{
			// TODO replace this with ripple load for selected page.
			return this._load_entire_graph()
		})
		.then(()=>
		{
			// Load relevant edges for this page.
			return this.dh_edge.track_all_for_page(id)
		})
		.then(()=>
		{
			return this.dh_edge.pull()
		})
		.then(()=>{
			// Only set hash if already set to something, otherwise can never back out past no-hash because
			// a hash is always added.
			if(window.location.hash != "") window.location.hash = page.name
			this.settings.page_loading = false
			// Cleanup and deactivate any settings overlays.
			this.reg_page_alter.deactivate()
			this.reg_page_new.deactivate()
			this.reg_resource_new.deactivate()
			this.render()
		})
		.catch((e)=>
		{
			console.error(e)
			this.settings.page_loading = false
			// If anything unhandled fails, this cleans up back to base state of 'nothing loaded'
			if(!prevent_rollback) return this.page_set(prev_id, true)
		})
	}

	/**
	 * This is the preferred way to set / unset the map view of the network. It's valid to merely change
	 * map_enabled and re-render the whole stack. However, calling this method edge-clears some other settings
	 * to preserve a more aesthetically pleasing transition.
	 * 
	 * @param {Boolean} map_enabled Whether map mode should be enabled.
	 */
	set_view(map_enabled)
	{
		if(map_enabled)
		{
			this.settings.show_editor = false
			this.settings.show_resources = false
		}
		this.settings.map_enabled = map_enabled

		this.render()
	}

	/**
	 * Use logic to determine what the overall title of this page should be. This is intended to be edge-triggered
	 * whenever a new page loads into the viewport. It's really not the best code and **definitely** needs to be
	 * refactored if setting title ever becomes more complex.
	 * 
	 * @param {String} iframe_title The iframe title, or undefined / "" if it doesn't have one.
	 */
	set_title(sub_title)
	{
		let title = "Cognatio"
		if(sub_title != undefined && sub_title.length != 0)
		{
			title = sub_title
		}
		else if(this.settings.page_id != undefined && this.dh_page.comp_get(this.settings.page_id) != undefined)
		{
			title = this.dh_page.comp_get(this.settings.page_id).name
		}

		document.title = title
	}

	/**
	 * Set the current logged-in user_id for this browser session. Sets in settings and edge triggers dh updates.
	 * 
	 * @param {Number} user_id The user ID or undefined if not logged in.
	 * 
	 * @returns {Promise} That resolves when set operation is complete.
	 */
	async set_user(user_id)
	{
		this.settings.user_id = user_id
		if(user_id == undefined) return Promise.resolve()

		// If there's a user specified, pull down data for it.
		this.dh_user.track_ids([user_id])
		return this.dh_user.pull()
	}

	/**
	 * Check an error that results from a request-based operation to see if the user merely needs to login.
	 * If the error is in fact a 403 (indicating a login is needed) present the user with a one or twochoice
	 * that tells them they need to login, or login to a different account.
	 * 
	 * @param {Error} e The error that was caught
	 * @param {String} title The title of the overlays that pops up. Should indicate the action attempted. Optional.
	 * 
	 * @returns {Promise} that reject immediately if not auth error or resolve when the user takes action otherwise
	 */
	async prompt_login(e, title)
	{
		title = title || "Action Not Authorized"
		if((e instanceof ErrorREST && e.data.http_code == 403) || (e.code == 403))
		{
			let prom
			if(this.swyd.settings.user_id == undefined)
			{
				prom = this.swyd.reg_two_choice.present_choice(
					title,
					"Authorization is required to perform this action, and you are not logged into an account. " +
					"Would you like to sign in?",
					"Go Back",
					"Log In"
				).then(()=>
				{
					this.swyd.reg_login.activate()
				})
			}
			else
			{
				prom = this.swyd.reg_one_choice.present_message(
					title,
					"Your user account is not authorized to perform this action."
				)
			}
			return prom
		}
		else
		{
			return Promise.resolve()
		}
	}
	
	_create_subregions()
	{
		this.reg_loading = new RegLoading().fab().link(this, document.getElementById('reg_loading'))
		this.reg_map = new RegMap().fab().link(this, this.cont_map)
		this.reg_editor = new RegEditor().fab().link(this, this.cont_editor)
		this.reg_resources = new RegResources().fab().link(this, this.cont_resources)
		this.reg_coords = new RegCoords().fab().link(this, this.cont_coords)
		this.reg_controls = new RegControls().fab().link(this, this.cont_controls)
		this.reg_page_new = new RegNewPage().fab().link(this, this.eth_reg_create()).etherealize()
		this.reg_page_alter = new RegAlterPage().fab().link(this, this.eth_reg_create()).etherealize()
		this.reg_resource_new = new RegResourceNew().fab().link(this, this.eth_reg_create()).etherealize()
		this.reg_one_choice = new RegOneChoiceNav().fab().link(this, this.eth_reg_create()).etherealize()
		this.reg_two_choice = new RegTwoChoiceNav().fab().link(this, this.eth_reg_create()).etherealize()
		this.reg_login = new RegLogin().fab().link(this, this.eth_reg_create()).etherealize()
	}

	async _create_datahandlers()
	{
		this.dh_page = new DHPage()
		this.dh_page_content = new DHPageContent(this)
		this.dh_page_resource = new DHPageResource(this)
		this.dh_edge = new DHEdge()
		this.dh_friend = new DHFriend()
		this.dh_user = new DHREST("/api/v1/user", false, false)

		this.datahandler_subscribe([this.dh_page, this.dh_page_content, this.dh_page_resource])
	}

	/**
	 * Overridden here to load user before rest of load is proceeded with.
	 */
	async _load_special()
	{
		return this.dispatch.call_server_function('get_logged_in_user_id').then((data)=>
		{
			return this.set_user(data['id'])
		})
	}

	async _load_datahandlers()
	{
		//TODO remove this track all nonsense and switch to ripple fetch.
		return this._load_entire_graph().then(()=>
		{
			return this._select_default_page()
		}).then((page_id)=>
		{
			this.settings.page_id = page_id
			return this.dh_page.pull()
		})
		
	}

	/**
	 * @returns {Promise} That tracks and pulls all pages and edges.
	 */
	async _load_entire_graph()
	{
		return this.dh_page.track_all().then(()=>
		{
			return this.dh_page.pull()
		}).then(()=>
		{
			return this.dh_edge.track_all()
		}).then(()=>
		{
			return this.dh_edge.pull()
		})
	}

	on_load_complete()
	{
		// Kick off the initial page load.
		this.page_set(this.settings.page_id)
		// Bind page redirect gestures
		this._bind_redirect_handlers()

		// Kick another lazy-load event for the available presets.
		this.dispatch.call_server_function("page_get_presets").then((presets)=>
		{
			this.settings.preset_urls = presets
			this.settings.presets = {}
			Object.keys(presets).forEach((k)=>{this.settings.presets[k] = k})
			this.reg_page_new.settings.preset = Object.keys(presets)[0]
			this.render() // This will re-render the page creation.
		})

		this.reg_loading.fade_out()

		// Start tracking hash changes.
		window.addEventListener('hashchange', ()=>
		{
			if(window.location.hash == this.settings.last_hash) return
			this._select_default_page().then((id)=>
			{
				this.settings.last_hash = window.location.hash
				return this.page_set(id)
			})
		})
		// Set first hash value manually
		if(this.settings.page_id != undefined)
		{
			let page = this.dh_page.comp_get(this.settings.page_id)
			this.settings.last_hash = "#" + page.name
			window.location.hash = page.name
		}
	}

	on_load_failed(e)
	{
		this.reg_one_choice.present_message(
			"Loading Error",
			"The COGNATIO NAVIGATOR encountered an unrecoverable error during loading."
		)
	}

	/**
	 * This will determine what the 'default' page should be. The logic is as follows:
	 * 1. Use the page in the current browser URL. If we're at /nav, then:
	 * 2. Check if there's an anchor. If not,
	 * 3. Use this.default_page_name. If that does not exist, then:
	 * 4. Return undefined.
	 * 
	 * @returns {Promise} That will resolve with ID or undefined.
	 */
	async _select_default_page()
	{
		return new Promise((res, rej)=>
		{
			let page_name
			if(String(window.location.pathname).includes("/page/"))
			{
				page_name = window.location.pathname.split('/').pop().split('.').pop()
			}
			else if(window.location.hash.length > 0)
			{
				page_name = window.location.hash.replace("#", "")
			}
			else
			{
				page_name = this.default_page_name
			}
			// Attempt to lookup the ID for this page name.
			this.dh_page.list({'name': page_name}).then((ids)=>
			{
				if(ids.length == 0)
				{
					res(undefined)
				}
				else
				{
					res(ids[0])
				}
			})
		})
	}

	/**
	 * @returns {CompPage} The active page or None if undefined
	 */
	get page_active()
	{
		if(this.settings.page_id == undefined) return undefined
		return this.dh_page.comp_get(this.settings.page_id)
	}

	/**
	 * Bind key event and gesture handlers that take us back to the non-navigator version of this page.
	 */
	_bind_redirect_handlers()
	{
		/**
		 * Called when the gesture is started with three touches.
		 * @param {TouchEvent} e 
		 */
		let gesture_start = (e)=>
		{
			this.settings.gesture = {
				'touches_start': {},
				'touches_last': {}
			}
			for(let i = 0; i < e.touches.length; i++)
			{
				let ident = e.touches[i].identifier
				this.settings.gesture.touches_start[e.touches[i].identifier] = {
					x: e.touches[i].clientX,
					y: e.touches[i].clientY,
				}
				this.settings.gesture.touches_start[ident] = {
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
				this.settings.gesture.touches_last[touches[i].identifier] = {
					x: touches[i].clientX,
					y: touches[i].clientY,
				}
			}
		}

		let gesture_end = ()=>
		{
			if(this.settings.gesture != undefined)
			{
				// Check to see if gesture was performed.
				let gesture_drags = 0
				Object.entries(this.settings.gesture.touches_start).forEach(([ident, coords_start])=>
				{
					let coords_last = this.settings.gesture.touches_last[ident]
					let pctx_travelled = (coords_last.x - coords_start.x) / window.innerWidth
					let pcty_travelled = (coords_last.y - coords_start.y) / window.innerWidth

					if(pctx_travelled > 0.5 && pcty_travelled < 0.5)
					{
						gesture_drags += 1
					}
				})
				this.settings.gesture = undefined

				if(gesture_drags == 3)
				{
					this._page_redirect()
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

			if(this.settings.gesture == undefined)
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

		document.addEventListener('keydown', (e)=>
		{
			if(e.ctrlKey && e.altKey && e.code == "KeyC")
			{
				this._page_redirect()
			}
		})
	}

	/**
	 * Redirect to the simple webpage version of whatever page the navigator is pointed at.
	 */
	_page_redirect = ()=>
	{
		// Infer page from location
		if(this.page_active == undefined) return

		window.location = "/page/" + this.page_active.name
	}

	_on_settings_refresh()
	{
		this.settings.page_id = undefined
		this.settings.show_editor = false
		this.settings.show_resources = false
		this.settings.map_enabled = false
		this.settings.editor_width = 0.5
		this.settings.page_loading = false
		this.settings.gesture = undefined
	}

	_on_render()
	{
		let sep_pct
		if(this.settings.show_editor)
		{
			sep_pct = 100*(1 - this.settings.editor_width)
		}
		else
		{
			sep_pct = 100
		}
		this.cont_map.style.width = `${sep_pct}%`
		this.cont_editor.style.left = `${sep_pct}%`
		this.cont_editor.style.width = `${100*this.settings.editor_width}%`

		if(this.settings.show_resources)
		{
			this.cont_resources.show()
		}
		else
		{
			this.cont_resources.hide()
		}
	}
}

export {RegSWNav}