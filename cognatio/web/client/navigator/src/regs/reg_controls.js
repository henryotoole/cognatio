/**
 * @file Contains the region for the controls pane in the top left.
 * @author Josh Reed
 */

import { Region, Fabricator, RHElement, RegInCheckbox } from "../lib/regional.js"
import { RegSWNav, RegInCBLever } from "../nav.js"

class RegControls extends Region
{
	fab_get()
	{
		let css = /* css */`
			[rfm_reg="RegControls"] {
				& .cont-main {
					pointer-events: all;
					display: flex;
					flex-direction: row;
					align-items: flex-start;
					
					padding-right: 1em;
					background-color: var(--brass-light);
					cursor: pointer;
					border-bottom-right-radius: 0.75em;
					border-bottom: 2px solid var(--brass-dark);
					border-right: 2px solid var(--brass-dark);
					
					position: relative;
					top: 0; left: 0;

					transition: 0.5s;
				}
				& .cont-main.collapsed {
					left: calc(1em - 100% - 1px);
				}
				& .cont-col {
					cursor: default;

					display: flex;
					flex-direction: column;
					align-items: flex-start;
					justify-content: center;
					padding: 0.5em;
					
					border-right: 1px solid var(--brass-dark);
				}
				& button {
					display: flex; flex-direction: row; align-items: center;
					margin-top: 0.5em;
				}
				& button:hover > .button-nameplate {
					text-decoration: underline;
				}
				& button:hover > .btn-circle {
					background-color: var(--brass-light);
				}
				& .btn-circle {
					box-sizing: border-box;
					width: 1.25em; height: 1.25em;
					border-radius: 1em;
					background-color: var(--brass);
					border: 1px solid var(--brass-dark);

					cursor: pointer;
				}
				& button label {
					cursor: pointer;
				}
			}
		`
		let html = /* html */`
			<machine rfm_member='ribbon' class='cont-main'>
				<div rfm_member='cont_col' class='cont-col bg-panel'>
					<div class='title'> CONTROLS </div>
					<button rfm_member='btn_page_new'>
						<div class='btn-circle'></div>
						<label class="button-nameplate legible">New</label>
					</button>
					<button rfm_member='btn_page_alter'>
						<div class='btn-circle'></div>
						<label class="button-nameplate legible">Alter</label>
					</button>
					<div class='cb-lever-group' style='margin-top: 0.75em'>
						<div rfm_member='checkbox_show_editor'></div><label class="nameplate legible">Editor</label>
					</div>
					<div class='cb-lever-group'>
						<div rfm_member='checkbox_show_resources'></div><label class="nameplate legible">Files</label>
					</div>
					<div class='cb-lever-group'>
						<div rfm_member='checkbox_map_enabled'></div><label class="nameplate legible">Map</label>
					</div>
				</div>
			</machine>
		`
		return new Fabricator(html).add_css_rule(css)
	}
	
	/** @type {RegSWNav} Reference to the switchyard region. */
	swyd
	/** @type {RHElement} */
	btn_page_new
	/** @type {RHElement} */
	btn_page_alter
	/** @type {RHElement} */
	checkbox_show_editor
	/** @type {RHElement} */
	checkbox_show_resources
	/** @type {RHElement} */
	checkbox_map_enabled
	/** @type {RHElement} */
	ribbon

	/** @description Settings object for this region. This is local data which is erased on page refresh. */
	settings = {
		/** @description Whether or not the controls panel is 'collapsed' to the left for editing. */
		collapsed: undefined
	}

	_create_subregions()
	{
		this.ricb_show_editor = new RegInCBLever().fab().link(
			this, this.checkbox_show_editor, this.swyd.settings, "show_editor"
		)
		this.ricb_show_resources = new RegInCBLever().fab().link(
			this, this.checkbox_show_resources, this.swyd.settings, "show_resources"
		)
		this.ricb_map_enabled = new RegInCBLever().fab().link(
			this, this.checkbox_map_enabled, this.swyd.settings, "map_enabled"
		)
	}

	_on_link_post()
	{
		this.btn_page_new.addEventListener("click", (e)=>{this.swyd.reg_page_new.activate()})
		this.btn_page_alter.addEventListener("click", (e)=>{this.swyd.reg_page_alter.activate()})

		this.ricb_show_editor.add_value_update_handler((value)=>{this.swyd.render()})
		this.ricb_show_resources.add_value_update_handler((value)=>{
			this.swyd.render()
			// This second call is neccessary, sadly, because a portion of the resources pane uses computed
			// widths to 'ballast' a bunch of tiles. Parents call children render methods before calling
			// their own, so the first render() calls the math functions when width is still = 0. A second
			// call clears things right up and a third call would have no action because of checksums.
			this.swyd.render()
			this.swyd.cont_scroll.scrollTo({
				top: this.swyd.cont_resources.clientHeight,
				behavior: "smooth"
			})
		})
		this.ricb_map_enabled.add_value_update_handler((value)=>{this.swyd.set_view(value)})

		this.ribbon.addEventListener("click", (e)=>{this.collapsed_toggle()})
		this.cont_col.addEventListener("click", (e)=>{e.stopPropagation()})
	}

	/**
	 * Toggle whether the controls panel is collapsed or fully visible;
	 */
	collapsed_toggle()
	{
		this.settings.collapsed = !this.settings.collapsed
		this.render()
	}

	_on_settings_refresh()
	{
		this.settings.collapsed = false
	}

	_on_render()
	{
		if(this.settings.collapsed)
		{
			this.ribbon.classList.add('collapsed')
		}
		else
		{
			this.ribbon.classList.remove('collapsed')
		}
	}
}

export {RegControls}