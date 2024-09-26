/**
 * @file The datahandler for the RESTful Edge table
 * @author Josh Reed
 */

import { DHREST } from "../lib/regional.js";
import { CompEdge } from "../nav.js";

class DHEdge extends DHREST
{
	constructor()
	{
		super('/api/v1/edge')
	}

	/**
	 * Get all edge's that touch a page and track all. This does not call pull().
	 * 
	 * @param {Number} page_id The ID of the page to start tracking all for
	 * 
	 * @returns {Promise} That resolves (with ids for convenience) when all nodes for indicated page are tracked.
	 */
	async track_all_for_page(page_id)
	{
		let all_ids = []
		return this.list({'page_id_orig': page_id}).then((ids)=>
		{
			all_ids = all_ids.concat(ids)
			return this.list({'page_id_term': page_id})
		}).then((ids)=>
		{
			all_ids = [...new Set([...all_ids,...ids])]
			this.track_ids(all_ids)
			return all_ids
		})
	}

	/**
	 * Get all edges that link to or from the indicated page. This performs no requests - DH should already be
	 * up to date.
	 * 
	 * @param {Number} page_id The ID of the page to get comps for
	 * 
	 * @returns {Array.<CompEdge>} A list of comps that link to or from this page
	 */
	get_edges_for_page(page_id)
	{
		out = []
		Object.entries(this._data).forEach(([id, data])=>
		{
			if(data.page_id_term == page_id || data.page_id_orig == page_id)
			{
				out.push(this.comp_get(id))
			}
		})
		return out
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
	 * @returns {CompEdge}
	 */
	comp_get(id)
	{
		return new CompEdge(id, this)
	}
}

export { DHEdge }