/**
 * @file Contains an ethereal region for creating a new page.
 * @author Josh Reed
 */

import {Region, Fabricator, RHElement, RegInInput, checksum_json, RegInCheckbox} from "../lib/regional.js"
import {RegSWNav, RegNewPage, RegInCBTypeset, RegPageFriends} from "../nav.js"

class RegAlterPage extends Region
{
	fab_get()
	{
		let css = /* css */`
			[rfm_reg="RegAlterPage"] {
				/* The absolute master container for the navigator. */
				& .cont-main {
					max-width: 100vw;
					width: 40em;
					display: flex;
					flex-direction: column;
				}
				& .cont-top {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
				}
				& .cont-mid {
					display: flex;
					flex-direction: column;
					padding: 0.5em;
				}
				& .cont-bot  {
					display: flex;
					justify-content: space-between;
				}
				& input {
					all: unset;
					cursor: text;
				}
			}
		`
		
		let html = /* html */`
			<punchcard class='cont-main punchcard-cont'>
				<div class='error'>
					<div rfm_member="error" class='error-inner'>ERROR</div>
				</div>
				<div class='cont-main background'>
					<div class='cont-top line-title'>
						<div> COG PAGE INSTRUCTION SET </div>
						<button rfm_member="close" class='button'> X </button>
					</div>
					<div class='cont-mid'>
						<div class='line underline'>
							Name:
							<label style='margin-left: 0.5em' rfm_member='regin_page_name_cont'></label>
						</div>
						<div class='line underline'>
							
						</div>
						<div class='line' style='margin-right: 1em'>
							<div class='underline' style='margin-right: 1em'> Read Access: </div>
							<label class='cb-label'>
								Public <div rfm_member='cbp_public' class='cb-cont'></div>
							</label>
							<label class='cb-label'>
								Friends <div rfm_member='cbp_friends' class='cb-cont'></div>
							</label>
							<label class='cb-label'>
								Private <div rfm_member='cbp_private' class='cb-cont'></div>
							</label>
						</div>
						<div rfm_member='access_list'></div>
					</div>
				</div>
				<div class='cont-bot'>
					<div style='flex-grow: 1;'>
						<div class='punchrow-bounder'></div>
						<div rfm_member='punchrow_cont' class='punchrow-cont'></div>
						<div class='punchrow-bounder'></div>
					</div>
					<div class='background button-br-cont' style='padding: 0.5em'>
						<button rfm_member='send' class='button'>>> Send</div>
					</div>
				</div>
			</punchcard>
		`
		return new Fabricator(html).add_css_rule(css)
	}

	/** @type {RegSWNav} Reference to the switchyard region. */
	swyd
	/** @type {RegInInput} The page-name regin */
	regin_page_name
	/** @type {RHElement} The div tag that contains the page-name regin.*/
	regin_page_name_cont
	/** @type {RHElement} Row in which to place punch holes.*/
	punchrow
	/** @type {RHElement}*/
	cbp_public
	/** @type {RHElement}*/
	cbp_friends
	/** @type {RHElement}*/
	cbp_private
	/** @type {RHElement} A div in which error text can be placed..*/
	error
	/** @type {RHElement}*/
	send
	/** @type {RHElement}*/
	close
	/** @type {RHElement}*/
	access_list

	/** @description Settings object for this region. This is local data which is erased on page refresh. */
	settings = {
		/** @description The page name as entered in input */
		page_name: undefined,
		/** @description The page read access bit */
		page_read_access: undefined,
		/** @description Error text to show to user */
		error: undefined,
	}

	_create_subregions()
	{
		// Create regin for text input
		this.regin_page_name = new RegInInput().fab().link(this, this.regin_page_name_cont, this.settings, "page_name")
		this.regin_page_name.member_get("input").setAttribute("readonly", "true")

		// Create regins for permission options
		this.regin_cbp_private = new RegInCBTypeset().fab().link(this, this.cbp_private, this.settings, "cbp_private")
		this.regin_cbp_friends = new RegInCBTypeset().fab().link(this, this.cbp_friends, this.settings, "cbp_friends")
		this.regin_cbp_public = new RegInCBTypeset().fab().link(this, this.cbp_public, this.settings, "cbp_public")
		this.regin_cbp_radio = RegInCheckbox.combine_into_radio(
			[this.regin_cbp_private, this.regin_cbp_friends, this.regin_cbp_public],
			[2, 1, 0],
			this.settings,
			'page_read_access'
		)

		// Setup the access list subregion
		this.reg_page_friends = new RegPageFriends().fab().link(this, this.access_list)
	}

	_on_link_post()
	{
		this.send.addEventListener('click', ()=>{
			this._alter_page().then(()=>
			{
				this.deactivate()
			})
		})
		this.close.addEventListener('click', ()=>{this.deactivate()})
	}

	/**
	 * Collect the settings configured on this card and fire a PUT request at the server.
	 * 
	 * @returns {Promise} That resolves when complete.
	 */
	async _alter_page()
	{
		this.settings.error = undefined
		return new Promise((res, rej)=>
		{
			if(this.settings.page_read_access == undefined)
			{
				this.settings.error = "ERROR: Read Access must be specified."
			}

			this.render()

			// If any errors, reject
			if(this.settings.error)
			{
				rej()
				return
			}

			// Apply data to datahandler
			this.swyd.page_active.data.name = this.settings.page_name
			this.swyd.page_active.data.read_access_int = this.settings.page_read_access

			this.swyd.dh_page.push().then(()=>
			{
				this.swyd.render()
				res()
			})
		})
		
	}

	_on_settings_refresh()
	{
		this.settings.page_name = ""
		this.settings.page_read_access = 0
		this.settings.error = undefined
	}

	_on_render()
	{
		// Punchrow
		let fwd_data = [this.settings.page_name, this.settings.page_read_access]
		let str_data = JSON.stringify(fwd_data).split("").reverse().join("")
		this.punchrow_cont.empty()
		this.punchrow_cont.append(RegNewPage.draw_punchrow(str_data))

		// Read Access Controls for Friends
		if(this.settings.page_read_access == 1)
		{
			this.access_list.show()
		}
		else
		{
			this.access_list.hide()
		}

		// Error
		if(this.settings.error)
		{
			this.error.show()
			this.error.text(this.settings.error)
		}
		else
		{
			this.error.hide()
		}
	}

	_on_activate_pre()
	{
		// Leave defaults if no page...
		if(this.swyd.page_active == undefined) return
		
		// Collect settings from data object
		this.settings.page_name = this.swyd.page_active.data.name
		this.settings.page_read_access = this.swyd.page_active.data.read_access_int
	}
}

export {RegAlterPage}