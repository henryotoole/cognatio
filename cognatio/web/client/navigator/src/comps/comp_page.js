/**
 * @file Contains the Page component
 * @author Josh Reed
 */

import {Component} from "../lib/regional.js"

class CompPage extends Component
{
	/**
	 * @returns {String} the name of this page
	 */
	get name()
	{
		return this.data.name
	}

	/**
	 * @returns {String} The absolute URL to the HTML for this page
	 */
	get page_url()
	{
		return `${window.location.origin}/page/${this.data.name}.html`
	}
}

export {CompPage}