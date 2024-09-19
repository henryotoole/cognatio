/**
 * @file Contains an ethereal region for creating a new page.
 * @author Josh Reed
 */

import {Region, Fabricator, RHElement, RegInInput, RegInCheckbox} from "../../regional/regional.js"
import {RegSWNav, HTML_STUBS, PageAccessMode, RegInCBTypeset} from "../nav.js"

class RegNewPage extends Region
{
	fab_get()
	{
		let css = /* css */`
			[rfm_reg="RegNewPage"] {
				& .cont-main {
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
						<div> COG NEW PAGE INSTRUCTION CARD </div>
						<button rfm_member="close" class='button'> X </button>
					</div>
					<div class='cont-mid'>
						<div class='line underline'>
							<label rfm_member='regin_page_name_cont'>Name: </label>
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
	/** @type {RHElement} Slot in which to place punchrow. */
	punchrow_cont
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
		this.regin_page_name.member_get("input").setAttribute("placeholder", "Random Name")

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
	}

	_on_link_post()
	{
		this.send.addEventListener('click', ()=>{
			this._create_page().then(()=>
			{
				this.deactivate()
			})
		})
		this.close.addEventListener('click', ()=>{this.deactivate()})
	}

	/**
	 * Launch a series of server commands to create a new page off of existing input data.
	 * 
	 * @returns {Promise} That resolves when the new page has been created with new page ID as argument.
	 */
	_create_page()
	{
		this.settings.error = undefined
		return new Promise((res, rej)=>
		{
			let reg = /^[a-zA-Z0-9_]*$/, name = this.settings.page_name
			if(name == undefined || name.length == 0)	{
				name = undefined
			}
			else if(name.search(reg) == -1)
			{
				this.settings.error = "ERROR: Name must be alphanumeric and contain no spaces."
			}
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

			this.swyd.dh_page.create(this.settings.page_read_access, name).then((new_id)=>
			{
				return this.swyd.dispatch.call_server_function('page_set_content', new_id, HTML_STUBS.BASIC).then(()=>
				{
					return this.swyd.page_set(new_id)
				})
			}).then(()=>
			{
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

	/**
	 * Create a punchrow on the basis of the binary representation of the provided string, which should represent
	 * any data that can change as a result of user input. This is a fun little method, but is purely cosmetic
	 * and has no utility for cognatio function.
	 * 
	 * @returns {RHElement} A constructed punchrow element.
	 */
	static draw_punchrow(str_data)
	{
		/**
		 * @returns {String}
		 */
		function text2Binary(string) {
			return string.split('').map(function (char) {
				return char.charCodeAt(0).toString(2);
			}).join(' ');
		}
		let binstr = text2Binary(str_data)

		let punchrow = document.createElement("div")
		punchrow.classList.add("punchrow")
		let pip

		pip = new Fabricator(/* html */ `<div class="punchrow-hole-padding" style='width: 0.5em'></div>`)
		pip.fabricate().append_to(punchrow)
		for(let i = 0; i < binstr.length; i++)
		{
			let char=binstr[i]
			if(char == "1")
			{
				pip = new Fabricator(/* html */ `<div class="punchrow-hole"></div>`)
			}
			else
			{
				pip = new Fabricator(/* html */ `<div class="punchrow-hole-padding"></div>`)
			}
			pip.fabricate().append_to(punchrow)
		}
		// Last padding pip has flex-grow: 1.
		pip = new Fabricator(/* html */ `<div class="punchrow-hole-padding" style="flex-grow: 1"></div>`)
		pip.fabricate().append_to(punchrow)

		return punchrow
	}
}

export {RegNewPage}