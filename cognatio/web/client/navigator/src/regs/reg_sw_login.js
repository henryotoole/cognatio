/**
 * @file The toplevel switchyard class for the simplified login interface.
 * @author Josh Reed
 */

import {RegionSwitchyard, Fabricator, RHElement, DHREST, ErrorREST} from "../lib/regional.js";
import {
	RegLoading,
	RegLogin,
} from "../nav.js";


/**
 * Central Switchyard for the Cognatio Simple Login.
 * 
 * **On Usage**
 * The goal of this switchyard is to expose the login functionality without loading the full cognatio app.
 * Mostly, this is for code re-use. This switchyard will only load in the neccessary elements to show the
 * login page in all its glory. No datahandlers are invoked or loaded. The entire navigator bundle is pulled
 * down, however.
 */
class RegSWLogin extends RegionSwitchyard
{
	constructor()
	{
		super()
		this.dispatch_config.load_functions = 1
	}

	fab_get()
	{
		let css = /* css */`

			[rfm_reg="RegSWLogin"] {

				/* The 'parent' class here is the <body> */
				overflow: hidden;

				& .cont-master {
					width: 100vw;
					display: flex;
					flex-direction: column;
					align-items: flex-start;
					justify-content: center;
				}
			}
		`
		let css_body = /* css */ `
			body {margin: 0px}
		`
		let html = /* html */`
		<div rfm_member='cont_master' class='cont-master'>
		</div>
		`
		return new Fabricator(html).add_css_rule(css).add_css_rule(css_body)
	}

	/** @description Settings object for this region. This is local data which is erased on page refresh. */
	settings = {
	}

	/** @type {RHElement} */
	cont_master
	/** @type {RegLogin} */
	reg_login
	
	_create_subregions()
	{
		this.reg_loading = new RegLoading().fab().link(this, document.getElementById('reg_loading'))
		this.reg_login = new RegLogin().fab().link(this, this.eth_reg_create()).etherealize()
	}

	on_load_complete()
	{
		this.reg_loading.fade_out()
	}

	on_load_failed(e)
	{
		console.error(e)
	}

	_on_settings_refresh()
	{
		
	}

	_on_render()
	{

	}
}

export {RegSWLogin}