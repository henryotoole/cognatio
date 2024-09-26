/**
 * @file The datahandler for the RESTful Page API
 * @author Josh Reed
 */

import { DHREST } from "../lib/regional.js";
import { CompPage } from "../nav.js";

const PageAccessMode =
{
	PUBLIC: 0,
	SHARED: 1,
	PRIVATE: 2
}

class DHPage extends DHREST
{
	constructor()
	{
		super('/api/v1/page')
	}

	/**
	 * Create a new page. This will not actually set any content for the page, use RPC for that.
	 * 
	 * @param {int} read_access Read access mode.
	 * @param {string} [name] Optional name to provide. If not provided, a random hash will be chosen.
	 * 
	 * @returns {Promise} That will resolve with the new ID as an argument when the new record has been created
	 */
	create(read_access, name=undefined)
	{
		let data = {
			read_access_int: read_access
		}
		if(name != undefined) data["name"] = name
		return super.create(data)
	}

	/**
	 * Get a component instance of the relevant type for this DataHandler. Component instances are really
	 * just containers for code that store both their settings and data back here in the datahandler. Multiple
	 * instances of a Component for the same ID will refer to the exact same locations in memory.
	 * 
	 * This may be called any number of times in any number of places, and all instances of a component for a
	 * certain ID will behave as if they are, in fact, the same component.
	 * 
	 * @param {*} id The ID to get a component for.
	 * @returns {CompPage}
	 */
	comp_get(id)
	{
		return new CompPage(id, this)
	}


	/**
	 * TODO finish this method. It will be quite complex, but very efficient. 
	 * 
	 * @param {Number} start_id The ID of the center of the ripple, or the start-node to traverse edges from.
	 * @param {Number} max_order The maximum number distance to track.
	 */
	track_and_pull_ripple(start_id, max_order)
	{

	}
}

export {DHPage, PageAccessMode}