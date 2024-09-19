/**
 * @file Datahandler for page content, that is, the HTML of a page
 * @author Josh Reed
 */

import { DataHandler, checksum_json } from "../../regional/regional.js"
import { RegSWNav } from "../nav.js"

/**
 * This datahandler is a relatively primitive container for the HTML content of a page. It uses a combination
 * of regular GET request and RPC to work with page content. It is intended for this to be used to store
 * a local version of remote code for editing and the occasional push to server.
 */
class DHPageContent extends DataHandler
{
	/** @type {RegSWNav} */
	swyd
	/** @type {String} The URL that was last pull()'d with. */
	_last_pulled_url
	/** @type {String} Checksum of data last time it was pushed.  */
	_last_pushed_checksum
	/** @type {Number} The ID of the page that is currently being tracked.  */
	_tracked_page_id
	/** @type {String} The URL of the page that is currently being tracked.  */
	_tracked_page_url

	/**
	 * Instantiate a new page.
	 * 
	 * @param {RegSWNav} swyd Instance of the switchyard, so that dispatch can be used for RPC
	 */
	constructor(swyd)
	{
		super()
		this._last_pulled_url = undefined
		this._last_pushed_checksum = undefined
		this._tracked_page_id = undefined
		this._tracked_page_url = undefined
		this.swyd = swyd
	}

	/**
	 * Get source code for the viewport. This is slightly different from the base source code - it will have
	 * some script code injected at the end so that internal comms can occur between the iframe and the nav app.
	 * 
	 * @returns {String} The source code to be loaded into the viewport.
	 */
	get_vp_src()
	{
		return this._data.page_src + this.iframe_tap_script
	}

	/**
	 * @returns {String} The literal current source
	 */
	get_src()
	{
		return this._data.page_src
	}

	/**
	 * Set the source data for the datahandler. This may originate from any location. Some modification may be
	 * performed on the source as it is set, if the source contained the special injected script code.
	 * 
	 * @param {String} new_src New code to set as the source data for this datahandler
	 */
	set_src(new_src)
	{
		this._data.page_src = new_src.replace(this.iframe_tap_script, "")
	}

	/**
	 * @returns {String} The literal code to be injected such that the VP will have iframe tapping enabled.
	 */
	get iframe_tap_script()
	{
		return /* html */`<script async src="/nav/src/navigator/etc/iframe_tap.js"></script>`
	}

	async pull()
	{
		// Caching check.
		if(this._last_pulled_url == this._tracked_page_url) return Promise.resolve()
		if(this._tracked_page_url == undefined)
		{
			this._data.page_src = ""
			return Promise.resolve()
		}

		return new Promise((res, rej)=>
		{
			fetch(
				this._tracked_page_url,
				{
					method: "GET"
				}
			).then((response)=>
			{
				if(response.status == 200)
				{
					return response.text()
				}
				else
				{
					rej(`Get source content for ${this._tracked_page_url} fails with code ${response.status}`)
				}
			}).then((response_text)=>
			{
				this._data.page_src = response_text
				this._last_pushed_checksum = this.generate_checksum()
				res()
			})
		})
	}

	/**
	 * Force a hard-pull that will get the current copy of HTML for the tracked URL regardless of local caching.
	 * This will overwrite any local changes that have been made. Beware!
	 */
	async pull_hard_refresh()
	{
		this._last_pulled_url = undefined
		return this.pull()
	}
	
	async push()
	{
		let current_checksum = this.generate_checksum()
		if(this._last_pushed_checksum == current_checksum || this._tracked_page_id == undefined)
		{
			return Promise.resolve()
		}

		return new Promise((res, rej)=>
		{
			this.swyd.dispatch.call_server_function("page_set_content", this._tracked_page_id, this.get_src()).then(()=>
			{
				this._last_pushed_checksum = current_checksum
				res()
			})
		})
	}

	/**
	 * @returns {Boolean} Whether or not the current source code has been changed since last pushed.
	 */
	can_push()
	{
		return this._last_pushed_checksum != this.generate_checksum()
	}

	get name() {return "dh_page_content"}

	/**
	 * Track a page by ID and URL. This will not instigate a new pull(), that must be done manually after
	 * calling this.
	 * 
	 * @param {Number} id The ID of the page to track
	 * @param {String} url The URL of the page to track
	 */
	track(id, url)
	{
		this._tracked_page_id = id
		this._tracked_page_url = url
	}

	generate_checksum() {return checksum_json(this._data)}
}

export {DHPageContent}