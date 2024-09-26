/**
 * @file Contains the 'coords' region code, for the coordinate meter at the bottom left of the page
 * @author Josh Reed
 */

import {Region, RegInInput, RHElement, Fabricator} from "../lib/regional.js";
import { RegSWNav } from "../nav.js"

class RegCoords extends Region
{
	fab_get()
	{
		let css = /* css */`
			[rfm_reg="RegCoords"] {
				/* The absolute master container for the navigator. */
				& .cont-outer {
					position: relative;
					top: 0; left: 0;
					display: flex;
					flex-direction: row;
					pointer-events: all;

					transition: 0.1s;
				}
				& .cont-outer.bump {
					left: -10px;
				}
				& .cont-outer.silly {
					left: 100vw;
					top: -200vh;
					transition: 10s;
				}
				& .cont-inner {

					display: flex;
					flex-direction: row;
					padding: 0.5em;
					align-items: center;
					cursor: default;
					border-right: 1px solid var(--brass-dark);
				}
				& .ribbon {
					cursor: pointer;

					padding-right: 1em; height: 100%;

					background-color: var(--brass-light);
					border-top-right-radius: 0.75em;
					border-top: 2px solid var(--brass-dark);
					border-right: 2px solid var(--brass-dark);
				}
				& .regin-page-name-cont {
					
				}
				& button:hover {
					text-decoration: underline;
				}
				& input {
					all: unset;
					cursor: text;
					color: white;
				}
			}
		`
		let html = /* html */`
			<machine rfm_member='cont_outer' class='cont-outer'>
				<div class='ribbon'>
					<div rfm_member='cont_inner' class='cont-inner bg-panel'>
						<div class='terminal'>
							<div style='margin-right: 0.1em'>>>/</div>
							<div rfm_member='regin_page_name_cont' class='regin-page-name-cont'></div>
						</div>
						<button rfm_member='btn_jump' class='button-nameplate legible'>Jump</button>
					</div>
				</div>
			</machine>
		`
		return new Fabricator(html).add_css_rule(css)
	}
	
	/** @type {RegSWNav} Reference to the switchyard region. */
	swyd
	/** @type {RHElement} */
	cont_outer
	/** @type {RHElement} */
	cont_inner
	/** @type {RHElement} */
	btn_jump
	/** @type {RegInInput} The page-name regin */
	regin_page_name
	/** @type {RHElement} The div tag that contains the page-name regin.*/
	regin_page_name_cont

	/** @description Settings object for this region. This is local data which is erased on page refresh. */
	settings = {
		/** @description ETC */
		local_page_name: undefined,
	}
	

	_create_subregions()
	{
		// Create regin for text input
		this.regin_page_name = new RegInInput().fab().link(this, this.regin_page_name_cont, this.settings, "local_page_name")
	}

	_on_link_post()
	{
		this.cont_inner.addEventListener("click", (e)=>{e.stopPropagation()})
		this.btn_jump.addEventListener('click', ()=>{
			this._jump().catch((e)=>
			{
				this.bump()
			})
		})
		this.regin_page_name.member_get('input').addEventListener('keydown', (e)=>
		{
			if(e.code == "Enter")
			{
				this._jump().catch((e)=>
				{
					this.bump()
				})
			}	
		})
	}

	/**
	 * Try to jump to whatever the local page name is.
	 * 
	 * @returns {Promise} That will resolve when page is loaded or reject when failed.
	 */
	async _jump()
	{
		return new Promise((res, rej)=>
		{
			if(this.settings.local_page_name == undefined || this.settings.local_page_name.length == 0)
			{
				this.settings.local_page_name = [
					"ENTRY NEEDED", "STILL NOT IT..." ,"I'M WARNING YOU", "MKAY BYE"
				][this.settings.silly]
				this.settings.silly += 1
				this.render()
				rej("No page.")
			}

			if(this.settings.local_page_name == this.swyd.page_active.name)
			{
				rej("Page already loaded.")
			}

			this.swyd.page_nav_url(`/page/${this.settings.local_page_name}`).then(()=>
			{
				res()
			})
		})
	}

	/**
	 * Cause the coords interface to 'bump' to the left for 0.2 seconds.
	 */
	bump()
	{
		this.cont_outer.classList.add('bump')
		window.setTimeout(()=>{this.cont_outer.classList.remove('bump')}, 100)
	}

	_on_render()
	{
		if(this.settings.silly >= 4) this.cont_outer.classList.add('silly')
	}

	/**
	 * On settings lifecycle:
	 * The local page name is effectively independent. When the page is changed at the swyd level, this setting
	 * will be forcibly overridden. Otherwise it's whatever the user most recently typed in.
	 */
	_on_settings_refresh()
	{
		this.settings.local_page_name = "ERROR"
		this.settings.silly = 0
	}
}

export { RegCoords }