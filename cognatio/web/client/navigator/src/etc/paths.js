/**
 * @file Some utilities for URL's and paths
 * @author Josh Reed
 */

/**
 * Determine whether or not a URL points to the same origin domain as the window.
 * 
 * @param {String} url A url
 * 
 * @returns {Boolean} True if provided URL is relative (presumably to origin) or has same origin as window.
 */
const url_is_internal = (url_string)=>
{
	// It's straight relative or invalid if this does not work. Either way it's not alternative-origin
	let url
	try
	{
		url = new URL(url_string)
	}
	catch(e)
	{
		return true
	}
	return url.origin === window.origin
}

/**
 * Try to convert this URL to a page name. This will get the last word of the path sans extension.
 * 
 * @param {String} url_string A string URL, relative or absolute
 * 
 * @returns {String} Name of the page to which this URL refers, or undefined if it does not refer to one.
 */
const url_to_page_name = (url_string)=>
{
	if(!url_is_internal(url_string)) return undefined

	let url
	try
	{
		// Try base url
		url = new URL(url_string)
	}
	catch(e)
	{
		// Try as relative url
		url = new URL(url_string, window.origin)
	}

	let path_bits = url.pathname.split("/")
	let fname_bits = path_bits[path_bits.length - 1].split(".")
	let fname = fname_bits[0]
	if(fname.length == "") return undefined
	return fname
}

export { url_is_internal, url_to_page_name }