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

				& .pastebox {
					width: 20vw;
					height: 20vw;
					position: absolute;
					top: 10vw;
					left: 10vw;
					z-index: 100000;
					background-color: white;
				}
			}
		`
		let css_body = /* css */ `
			body {margin: 0px}
		`
		let html = /* html */`
		<div rfm_member='cont_master' class='cont-master'>
			<div rfm_member='pastebox' class='pastebox'>pastebox</div>
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

	async _create_datahandlers()
	{
		this.dh_user = new DHREST("/api/v1/user", false, false)
	}

	on_load_complete()
	{
		this.reg_login.activate()
		this.reg_loading.fade_out()
		this.paste_experiment()
	}

	paste_experiment()
	{

		this.pastebox.addEventListener('paste', (e)=>
		{
			e.preventDefault();
			console.log("Caught the paste!")

			console.log(e.clipboardData.getData('text'))
			let files = e.clipboardData.files
			for(let i = 0; i < files.length; i++)
			{
				console.log(files[i])
			}
		})
	}

	on_load_failed(e)
	{
		console.error(e)
	}

	/**
	 * Called when the user successfully logs in. Will redirect back to whatever page originated the login
	 * or to 'nav' if there's no originator.
	 * 
	 * @param {Number} user_id The user ID or undefined if not logged in.
	 * 
	 * @returns {Promise} That resolves when set operation is complete.
	 */
	async set_user(user_id)
	{
		let url = new URL(window.location),
			next = url.searchParams.get('next')
			
		if(!next)
		{
			next = "/nav"
		}

		window.location.href = next

		return Promise.resolve()
	}

	_on_settings_refresh()
	{
		
	}

	_on_render()
	{

	}
}

export {RegSWLogin}