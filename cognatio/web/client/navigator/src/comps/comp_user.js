/**
 * @file Contains the User component
 * @author Josh Reed
 */

import {Component} from "../lib/regional.js"

class CompUser extends Component
{
	/**@description Data for this component */
	data = {
		/**@type {Number} The user's ID */
		id: undefined,
		/**@type {String} The user's email */
		email: undefined
	}
}

export {CompUser}