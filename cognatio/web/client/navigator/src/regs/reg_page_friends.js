/**
 * @file Contains an inline region used to configure a page's tracked friends.
 * @author Josh Reed
 */

import {Region, Fabricator, RHElement, RegInInput, checksum_json, RegInCheckbox} from "../lib/regional.js"
import {RegSWNav, CompUser} from "../nav.js"

class RegPageFriends extends Region
{
	fab_get()
	{
		let css = /* css */`
			[rfm_reg="RegPageFriends"] {
				& input {
					all: unset;
					cursor: text;
				}
				& .main {
					width: 100%;
				}
				& .entry {
					display: flex; flex-direction: row;
					align-items: center;
					height: 1.5em;
					margin-left: 0.75em; margin-right: 0.75em;
					margin-top: 0.75em;
				}
				& .email {
					height: 1.5em;
					line-height: 1.5em;
					width: 20ch;
					text-overflow: ellipsis;
					overflow: hidden;
					border-bottom: 1px solid var(--punchcard-beige-darker);
				}
				& .btn_user {
					display: flex; align-items: center; justify-content: center;
					width: 1.5em;
					height: 1.5em;
					padding-top: 0.2em;
					box-sizing: border-box;
					border: 1px solid var(--punchcard-beige-darker);
					margin-left: 0.5em;
				}
				& .btn_user:hover {
					text-decoration: underline;
				}
				& .btn_add {
					margin-left: 0.5em;
					border-bottom: 1px solid transparent;
				}
				& .btn_add:hover {
					border-bottom: 1px solid var(--punchcard-beige-darker);
				}
				& .cont-scrolling {
					width: 100%; height: 100%;
					overflow: scroll;
					max-height: 30vh;
				}
				& .cont-friends {
					width: 100%; height: 100%;
					display: flex; flex-direction: row;
					justify-content: center;
					flex-wrap: wrap;
					padding-bottom: 1px;
				}
				& .search-box {
					border: 1px solid var(--punchcard-beige-darker);
					position: relative;
					padding-bottom: 0.75em;
					margin-top: 0.75em;
				}
				& .search_input {
					border-bottom: 1px solid var(--punchcard-beige-darker);
				}
				& [rfm_member='search_loading_slot'] {
					padding: 0.75em;
					position: absolute;
					top: 0;
					left: 0;
				}
			}
		`
		
		let html = /* html */`
		<div class='cont'>
			<div class='row line underline' style='justify-content: space-between'>
				<div> People With Access: </div>
				<button rfm_member='btn_grant_access' class='button'> >> Grant Access </div>
			</div>
			<div rfm_member='list_cont' class='cont-scrolling'>
				<div class='cont-friends' rfm_member='list'></div>
			</div>
			<div rfm_member='search_cont' class='cont-scrolling search-box'>
				<div>
					<div class='row line' style='justify-content: center;'>
						<div style='margin-right: 0.5em'>Search by Email:</div>
						<div rfm_member='search_input'></div>
					</div>
					<div rfm_member='results'></div>
					<div rfm_member='search_loading_slot'></div>
				</div>
			</div>
		</div>
		`
		return new Fabricator(html).add_css_rule(css)
	}

	/** @type {RegSWNav} Reference to the switchyard region. */
	swyd
	/** @type {RHElement}*/
	list
	/** @type {RHElement}*/
	list_cont
	/** @type {RHElement}*/
	results
	/** @type {RHElement}*/
	search_cont
	/** @type {RHElement}*/
	search_input
	/** @type {RHElement}*/
	btn_grant_access
	/** @type {RHElement}*/
	search_loading_slot

	/** @description Settings object for this region. This is local data which is erased on page refresh. */
	settings = {
		/** @description Whether or not data is loading for users. */
		loading: undefined,
		/** @description Whether or not search results are loading. */
		results_loading: undefined,
		/** @description The search terms as typed, to search for a user. */
		search_terms: undefined,
		/** @description List of user ID's that have matched the search params. */
		search_results: undefined,
		/** @description Whether or not to show search pane */
		searching: undefined
	}

	_create_subregions()
	{
		this.regin_search = new RegInInput().fab().link(this, this.search_input, this.settings, "search_terms")
		this.regin_search.member_get("input").setAttribute("placeholder", "No Search Terms")
		this.regin_search.member_get("input").classList.add('search_input')
	}

	_on_link_post()
	{
		this.datahandler_subscribe(this.swyd.dh_friend)
		this.datahandler_subscribe(this.swyd.dh_user)

		this.btn_grant_access.addEventListener('click', ()=>
		{
			this.settings.searching = true
			this.render()
		})

		this.regin_search.add_value_update_handler((search_string)=>
		{
			this.search(search_string)
		})
	}

	/**
	 * This will load the 'friends' pivot table and user objects for all associated friends for this page.
	 * 
	 * In other words, all needed data for this region is ensured to be loaded when this is called.
	 * 
	 * @returns {Promise} That resolves when loaded
	 */
	async load_friends()
	{
		return this.swyd.dh_friend.track_all_for_page(this.swyd.settings.page_id)
		.then(()=>
		{
			return this.swyd.dh_friend.pull()
		})
		.then(()=>
		{
			return this.swyd.dh_user.track_ids(
				this.swyd.dh_friend.local_data_get_friends_for_page(this.swyd.settings.page_id)
			)
		})
		.then(()=>
		{
			return this.swyd.dh_user.pull()
		})
	}

	/**
	 * Revoke access to the current page for the provided user.
	 * 
	 * @param {CompUser} user User component instance
	 */
	access_revoke(user)
	{
		this.swyd.dh_friend.access_revoke(this.swyd.settings.page_id, user.id).then(()=>
		{
			this.render()
		})
	}

	/**
	 * Grant access to the current page for the provided user.
	 * 
	 * @param {CompUser} user User component instance
	 */
	access_grant(user)
	{
		this.swyd.dh_friend.access_grant(this.swyd.settings.page_id, user.id).then(()=>
		{
			this.settings.searching = false
			this.render()
		}).catch((e)=>{
			this.swyd.prompt_login(e, "Access Control Not Authorized").then(()=>
			{
				this.deactivate()
			})
			throw(e)
		})
	}

	/**
	 * This function will cause the search string to be fired against the server and update both local data
	 * and the local settings key with matching data.
	 * 
	 * Then it will re-render the results.
	 * 
	 * This function will do nothing if the previous search network requests are still processing.
	 */
	search(search_string)
	{
		if(this.settings.results_loading) return

		this.settings.results_loading = true
		this.render()

		// Perform search
		this.swyd.dh_user.list(undefined, {'search': search_string}).then((matching_ids)=>
		{
			this.swyd.dh_user.track_ids(matching_ids)
			this.settings.search_results = matching_ids
			// Update local data
			return this.swyd.dh_user.pull()
		})
		.then(()=>
		{
			// Display
			this.settings.results_loading = false
			this.render()
		})
		.catch((e)=>
		{
			this.settings.results_loading = false
			throw(e)
		})

		
	}

	_on_settings_refresh()
	{
		this.settings.loading = true // Loading whenever activated.
		this.settings.results_loading = false
		this.settings.search_terms = ""
		this.settings.search_results = []
		this.settings.searching = false
	}

	_on_render()
	{
		this._render_list()
		this._render_search()

		if(this.settings.searching)
		{
			this.search_cont.show()
		}
		else
		{
			this.search_cont.hide()
		}
	}

	/**
	 * Render the list of users with access.
	 */
	_render_list()
	{
		this.list.empty()
		if(this.settings.loading)
		{
			this._draw_loading().append_to(this.list)
		}
		else
		{
			// Add users
			let user_ids = this.swyd.dh_friend.local_data_get_friends_for_page(this.swyd.settings.page_id)
			let users = []
			user_ids.forEach((user_id)=>{users.push(this.swyd.dh_user.comp_get(user_id))})

			//users = [
			//	{data: {email: 'agrafena_alexandrova@test.test', id: 1}},
			//	{data: {email: 'dmitri_karamazov@test.test', id: 2}},
			//	{data: {email: 'father_paissy@test.test', id: 3}},
			//	{data: {email: 'fyodor_pavlovich@test.test', id: 3}},
			//]

			users.forEach((data)=>
			{
				this._draw_user(data).append_to(this.list)
			})
			if(users.length % 2 != 0)
			{
				let counterweight = document.createElement("div")
				counterweight.style.width = "calc(20ch + 2em)"
				counterweight.classList.add('entry')
				this.list.append(counterweight)
			}
		}
	}

	/**
	 * Render the search results and query section.
	 */
	_render_search()
	{
		this.results.empty()
		this.search_loading_slot.empty()

		if(this.settings.search_results.length > 0)
		{
			let friend_ids = this.swyd.dh_friend.local_data_get_friends_for_page(this.swyd.settings.page_id)
			this.settings.search_results.forEach((user_id)=>
			{
				if(friend_ids.indexOf(user_id) == -1)
				{
					this._draw_result(this.swyd.dh_user.comp_get(user_id)).append_to(this.results)
				}
			})
		}
		else
		{
			let el = document.createElement('div')
			el.textContent = "No Results Found"
			el.classList.add('entry')
			this.results.append(el)
		}
	
		// A loading key is appended, if currently searching.
		if(this.settings.results_loading)
		{
			this._draw_loading().append_to(this.search_loading_slot)
		}
	}

	/**
	 * Create and return an Fabricator instance for a user within the list of 'people with access'
	 * 
	 * @param {CompUser} user User component instance
	 * 
	 * @returns {Fabricator}
	 */
	_draw_user(user)
	{
		let html = /* html */`
		<div class='entry'>
			<div class='email'>${user.data.email}</div>
			<button class='btn_user' rfm_member='delete'>X</button>
		</div>
		`
		let fab = new Fabricator(html).fabricate()
		fab.get_member('delete').addEventListener('click', ()=>
		{
			this.access_revoke(user)
		})
		return fab
	}

	/**
	 * Create and return an Fabricator instance for a user within the list of search results
	 * 
	 * @param {CompUser} user User component instance
	 * 
	 * @returns {Fabricator}
	 */
	_draw_result(user)
	{
		let html = /* html */`
		<div class='entry' style='align-items: flex-end'>
			<div class='email'>${user.data.email}</div>
			<button class='btn_add' rfm_member='grant_access'> >> Add User </button>
		</div>
		`
		let fab = new Fabricator(html).fabricate()
		fab.get_member('grant_access').addEventListener('click', ()=>
		{
			this.access_grant(user)
		})
		return fab
	}

	/**
	 * Create and return a Fabricator instance with a 'loading' segment, which will take the form of a div
	 * containing text that says `LOADING >> _` where the underscore is flashing.
	 */
	_draw_loading()
	{
		let html = /* html */`
			<div rfm_member='main' style='width: 15ch; color: var(--red);'> LOADING >> </div>
		`
		let fab = new Fabricator(html)
		// Will disable this interval when loading is removed.
		let blinker = window.setInterval(()=>
		{
			try {
				let el = fab.get_member('main')
				if(!document.body.contains(el))
				{
					window.clearInterval(blinker)
				}
				if(el.textContent == 'LOADING >> _')
				{
					el.textContent = "LOADING >>"
				}
				else
				{
					el.textContent = "LOADING >> _"
				}
			} catch {
				window.clearInterval(blinker)
			}
		}, 1000)
		return fab.fabricate()
	}

	_on_activate_post()
	{
		this.load_friends().then(()=>
		{
			this.settings.loading = false
			this.render()
		})
	}
}

export {RegPageFriends}