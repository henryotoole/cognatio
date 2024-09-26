/**
 * @file A basic component class for a file
 * @author Josh Reed
 */

import { Component, path_ext } from "../lib/regional.js";

const icon_map = {
	'png': 'self',
	'jpg': 'self',
	'jpeg': 'self',
	'svg': 'self',
	'txt': '/s/assets/icons/file_text.svg',
	'md': '/s/assets/icons/file_text.svg',
	'log': '/s/assets/icons/file_text.svg',
	'unknown': '/s/assets/icons/file_unknown.svg',
}

class CompFile extends Component
{
	/**
	 * @returns {String} Extension for this file, parsed from filename.
	 */
	get ext()
	{
		return path_ext(this.id)
	}

	/**
	 * @returns {String} The filename of this file. This is a pure convenience getter.
	 */
	get filename()
	{
		return this.id
	}

	/**
	 * The logic here is not terribly complex - certain formats will simply use their own URL (images) and
	 * others map to a fixed set of icons.
	 * 
	 * @returns {String} The correct icon URL for this file, as interpreted by the file extension
	 */
	get icon_url()
	{
		let url = icon_map[this.ext]
		if(url == "self") url = this.data.url
		if(!url) url = icon_map["unknown"]
		return url
	}
}

export { CompFile }