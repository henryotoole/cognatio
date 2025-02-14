/**
 * @file A region for the Page viewport. It's a glorified iframe.
 * @author Josh Reed
 */

import { Region, Fabricator, RHElement, checksum_json } from "../lib/regional.js"
import { RegSWNav } from "../nav.js"

/**
 * The Viewport region contains an iframe to show cognatio Pages within the navigator itself. This iframe will
 * flex and change depending on the presence and size of the editor. It also handles mundane things like
 * showing a loading wheel, etc.
 */
class RegViewport extends Region
{
	fab_get()
	{
		// Note that the toplevel nesting selector matches attribute rfm_reg="RegViewport". This attribute is
		// automatically added to regions' reg element when they are linked.
		let css = /* css */`
			[rfm_reg="RegViewport"] {
				/* Hold the text area and search box vertically in a column. */
				& .cont_main {
					width: 100%; height: 100%;
					display: flex;
					flex-direction: column;
					align-items: flex-start;
					justify-content: center;
				}
				& .events-disabled {
					pointer-events: none;
				}
			}
		`
		let html = /* html */`
			<iframe rfm_member='vp_iframe' class='cont_main'>
			</iframe>
			<div rfm_member='loading_layer' class='cog-loading-layer'>
				<div class='cog-loader'></div>
			</div>
		`
		return new Fabricator(html).add_css_rule(css)
	}

	/** @type {RegSWNav} Reference to the switchyard region. */
	swyd
	/** @type {RHElement} */
	vp_iframe
	/** @type {RHElement} */
	loading_layer

	_on_link_post()
	{
		this.datahandler_subscribe(this.swyd.dh_page_content)
		this.render_checksum_add_tracked('map_enabled', ()=>{return this.swyd.settings.map_enabled})
		this.render_checksum_add_tracked('loading', ()=>{return this.swyd.settings.page_loading})
		window.document.addEventListener('iframe_href_nav', (e)=>{this._on_iframe_href_nav_event(e)})
		window.document.addEventListener('iframe_title', (e)=>{this._on_iframe_title_event(e)})
	}

	/**
	 * This method handles custom events generated by the iframe tap within the iframe's context.
	 * 
	 * @param {CustomEvent} e Custom event from our code in the iframe.
	 */
	_on_iframe_href_nav_event(e)
	{
		let target_url = e.detail.link
		this.swyd.page_nav_url(target_url).catch((e)=>
		{
			if(e._nonexist)
			{
				this.swyd.reg_two_choice.present_choice(
					"Create New Page?",
					`The page '${e._page_name}' does not yet exist. Would you like to create it?`,
					"No", "Yes"
				).then(()=>
				{
					this.swyd.reg_page_new.activate()
					this.swyd.reg_page_new.settings.page_name = e._page_name
					this.swyd.render()
				})
			}
			else if(e._non_internal)
			{
				window.open(target_url, '_blank')
			}
		})
	}

	/**
	 * This method handles custom events generated by the iframe tap for title update.
	 * 
	 * @param {CustomEvent} e Custom event from our code in the iframe.
	 */
	_on_iframe_title_event(e)
	{
		let iframe_title = e.detail.title
		this.swyd.set_title(iframe_title)
	}

	/**
	 * This is called every render to update the source code of the iframe. iframe source is 100% managed
	 * by the Viewport region. When the iframe code is updated, the iframe's internal js restarts and all
	 * memory is lost. This should occur as infrequently as possible (only when code has changed) so that
	 * if there's code running in the viewport it does not constantly restart.
	 */
	_iframe_code_update()
	{
		let src = this.swyd.dh_page_content.get_vp_src()
		let src_cs = checksum_json({'src': src})
		if(this._last_src_cs == src_cs) return

		this._last_src_cs = src_cs
		this.vp_iframe.setAttribute('srcdoc', src)
	}
	
	_on_render()
	{
		this._iframe_code_update()

		this.vp_iframe.class_set('events-disabled', this.swyd.settings.map_enabled)

		// Loading state.
		this.loading_layer.style.opacity = this.swyd.settings.page_loading ? "35%" : ""
	}
}

export {RegViewport}