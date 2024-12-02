/**
 * @file The datahandler for the RESTful Friend junction table
 * @author Josh Reed
 */

import { DHREST } from "../lib/regional.js";
import { CompUser, CompPage } from "../nav.js";

class DHFriend extends DHREST
{
	constructor()
	{
		super('/api/v1/friend')
	}

	/**
	 * Get all friend records that touch a page and track all. This does not call pull().
	 * 
	 * @param {Number} page_id The ID of the page to start tracking all for
	 * 
	 * @returns {Promise} That resolves (with ids for convenience) when all records for this page are tracked.
	 */
	async track_all_for_page(page_id)
	{
		return this.list({'page_id': page_id}).then((ids)=>
		{
			this.track_ids(ids)
		})
	}

	/**
	 * Get all users that are listed with read access (e.g. 'friends') for a page. This only looks at local
	 * records, does not check server.
	 * 
	 * @param {Number} page_id The ID of the page to get comps for
	 * 
	 * @returns {Array.<Object>} A list references to data for junction table records for this page
	 */
	local_data_get_friends_for_page(page_id)
	{
		let out = []
		Object.entries(this._data).forEach(([id, data])=>
		{
			id = Number(id) // Object.entires converts to string
			if(data.page_id == page_id)
			{
				out.push(data.user_id)
			}
		})
		return out
	}

	/**
	 * Grant a user read access.
	 * 
	 * Under the hood, this just adds a new junction table record.
	 * 
	 * @param {Number} page_id The ID of the page to add access to
	 * @param {Number} user_id The ID of the user to grant read access to
	 * 
	 * @returns {Promise}
	 */
	access_grant(page_id, user_id)
	{
		console.log([page_id, user_id])
		return this.create({
			'page_id': page_id,
			'user_id': user_id
		})
	}

	/**
	 * Revoke read access from a user.
	 * 
	 * Under the hood, this just removes any record that exists to tie the provided user to page
	 * 
	 * @param {Number} page_id The ID of the page to revoke access from
	 * @param {Number} user_id The ID of the user to grant revoke access from
	 * 
	 * @returns {Promise}
	 */
	access_revoke(page_id, user_id)
	{
		let rec = undefined
		Object.entries(this._data).forEach(([id, data])=>
		{
			id = Number(id) // Object.entires converts to string
			if(data.page_id == page_id && data.user_id == user_id)
			{
				rec = data
			}
		})

		if(rec)
		{
			return this.delete(rec.id)
		}
		else
		{
			return Promise.resolve()
		}
	}
}

export { DHFriend }