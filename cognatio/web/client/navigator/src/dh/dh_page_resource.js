/**
 * @file A datahandler for a 'page resource', a sort of informal file stored in a directory relative to a page
 *       and inheriting it's permissions.
 * @author Josh Reed
 */

import { DHREST, serial_promises } from "../lib/regional.js";
import { CompFile } from "../nav.js";

/**
 * The page resource client rest handler is a bit of a strange off-shoot. Page resources are notably NOT flat,
 * they do not have a coherent ID structure. An instance of this datahandler must point at a single DHPage ID
 * at a time in order to work.
 * 
 * Instead of ID's, filenames (including extension) are used.
 * 
 * File uploads are achieved with the create() function. Downloads are achieved entirely separately using the
 * static URL that forms the data for each file known to the instance.
 * 
 * The PUT / update method and push() are disabled, as files can not be modified once created. They can, however,
 * be deleted and re-uploaded under the same name.
 */
class DHPageResource extends DHREST
{
	/** @type {Number} The ID of the page that this datahandler is looking at the resources of. */
	current_page_id
	/** @type {Number} The max size of a payload that will be sent in a single request. */
	_max_payload_size

	constructor()
	{
		// This forms a 'base' URL which must be extended for use.
		super('/api/v1/page', false, false)

		this.current_page_id = undefined
		this._max_payload_size = 512*1024 // 0.5MB
	}

	/**
	 * Set the page to look at the resources of. This will clear any existing data.
	 * 
	 * @param {Number} page_id 
	 */
	current_page_set(page_id)
	{
		this.current_page_id = page_id
		// Clear all data
		this.untrack_all()
	}

	/**
	 * @param {*} id The ID to get a URL for, or undefined for base URL e.g. /api/url/
	 * @returns {URL} Of the form www.xxxxxx.com/api/url/id
	 */
	_url_for(id)
	{
		if(id)
		{
			return new URL(this.current_page_id + "/resource/" + id, this.api_url + "/")
		}
		else
		{
			return new URL(this.current_page_id + "/resource", this.api_url + "/")
		}
	}

	/**
	 * Create a new file. The file name must be specified and a file object provided. The file might be
	 * broken up into parts if it is sufficiently large. The file name should not already exist.
	 * 
	 * **On Checksum**
	 * Currently there's a discrepancy between the serverside checksum implementation and clientside. Digging
	 * through this is going to take loads of time. For the present I'm just going to check that filesize matches.
	 * When the upload is complete, the returned checksum will be verified locally.
	 * 
	 * @param {String} file_name The name the file shall have, including extension. This is the same as "ID"
	 * @param {Blob} file The file to upload
	 * @param {Function} prog_cb A callback that will report progress as a float.
	 * 
	 * @returns {Promise} That will resolve when the file has been uploaded and verified.
	 */
	async create(file_name, file, prog_cb)
	{
		if(!prog_cb) prog_cb = ()=>{}
		return new Promise((res, rej)=>
		{
			// Cut the file up into pieces on the basis of size.
			let promise_fns = []
			let start_loc = 0
			while(start_loc < file.size)
			{
				// End at next ending point or end of file, whichever is closer
				let end_loc = Math.min(start_loc + this._max_payload_size, file.size)
				let payload = file.slice(start_loc, end_loc)
				let _start_loc = start_loc // Ensure ref is preserved
				promise_fns.push(()=>
				{
					return this._create(file_name, payload, _start_loc).then((data)=>
					{
						prog_cb(end_loc / file.size)
						return data
					})
				})

				start_loc = end_loc
			}

			return serial_promises(promise_fns).then((returned_data_list)=>
			{
				let final_data = returned_data_list.pop()
				let id = final_data[this._id_key]

				// Ensire filesize matches
				if(file.size != final_data.size) throw new Error("Error in upload: resulting filesizes do not match.")

				this._local_data_set_from_server(id, final_data)

				res(id)
			})
		})
	}

	/**
	 * Upload one chunk of a file (or the whole file). Returned data includes checksum
	 * 
	 * @param {String} file_name The name the file shall have, including extension. This is the same as "ID"
	 * @param {Blob} payload A binary object to send as a payload
	 * @param {Number} offset Write offset in bytes for this chunk. Zero for first chunk or whole file.
	 * 
	 * @returns {Promise} That will resolve with the returned data as an argument when the upload is complete.
	 */
	async _create(file_name, payload, offset)
	{
		return new Promise((res, rej)=>
		{
			const form_data = new FormData()
			form_data.append("file", payload)
			form_data.append("write_offset", offset)
			fetch(
				this._url_for(file_name),
				{
					method: "POST",
					body: form_data,
					// Note that headers are NOT set for form data. Browser will do it
				}
			).then((response)=>{
				if(response.status == 200)
				{
					res(response.json())
				}
				else
				{
					rej(`Creation of new ${this.constructor.name} fails with code ${response.status}`)
				}
			})
		})
	}

	/**
	 * Disable _put and push() manually.
	 */
	async _put(id, data)
	{
		throw new Error("PUT is not allowed for this type of resource.")
	}

	/**
	 * Get a component instance of the relevant type for this DataHandler. Component instances are really
	 * just containers for code that store both their settings and data back here in the datahandler. Multiple
	 * instances of a Component for the same ID will refer to the exact same locations in memory.
	 * 
	 * This may be called any number of times in any number of places, and all instances of a component for a
	 * certain ID will behave as if they are, in fact, the same component.
	 * 
	 * @param {String} filename the filename with extension. This doubles as ID for this DH.
	 * 
	 * @returns {CompFile}
	 */
	comp_get(filename)
	{
		return new CompFile(filename, this)
	}
}

export { DHPageResource }