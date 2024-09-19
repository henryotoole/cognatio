/**
 * @file Contains a region that displays while data is loaded.
 * @author Josh Reed
 */

import { RegConstellation } from "../nav.js";
import { Region, Fabricator, RHElement } from "../../regional/regional.js";

/**
 * The loading region is displayed during the intial loading states of the page. These states can be broken
 * into the following:
 * 1. Page itself is loading. Nothing is rendered, browser is in control.
 * 2. Base page HTML loads, and scripts, css, etc. all start to load. The raw HTML is visible at this point.
 * 3. Scripts etc. load and regional instantiates. Datahandlers are loading. Now code can control the view,
 *    but final state can not yet be shown because on_load_complete() has not yet been called.
 * 4. All needed initial state is loaded and regular operations can proceed.
 * 
 * This loading region ties into a primordial HTML element that's present at the first paint of the page.
 * In Stage 2, the primordial element is shown. Then in Stage 3, this region loads and can act on it.
 * 
 * In practice, Stage 2 will be a large black square. Stage 3 will be a Flamsteed-style star map of a bunch
 * of randomly placed nodes.
 */
class RegLoading extends Region
{
	fab_get()
	{
		let css = /* css */`
			[rfm_reg="RegLoading"] {
				& .cont-outer {
					position: relative;
					top: 0; left: 0;
					width: 100%; height: 100%;
					
					opacity: 100%;
					background-color: var(--white-off);
				}
			}
		`
		let html = /* html */`
			<div rfm_member='cont_outer' class='cont-outer'>
			</div>
		`
		return new Fabricator(html).add_css_rule(css)
	}
	
	/** @type {RegSWNav} Reference to the switchyard region. */
	swyd
	/** @type {RHElement} */
	cont_outer

	_create_subregions()
	{
		this.reg_constellation = new RegConstellation({
			text_left: "COGNATIO",
			text_right: "LOADING"
		}).fab().link(this, this.cont_outer)
	}

	_on_link_post()
	{
		// Hide the master region. It was only ever shown for loading stage 1, which is over by this point.
		this.reg.style.backgroundColor = 'transparent'
	}

	/**
	 * Causes this region to fade to 0% opacity and then deactivate entirely.
	 * 
	 * @returns {Promise} that resolves when fade-out is complete.
	 */
	async fade_out()
	{
		let fade_rate_s = 1
		this.cont_outer.style.opacity = "0%"
		this.cont_outer.style.transition = `${fade_rate_s}s`
		
		return new Promise((res, rej)=>
		{
			window.setTimeout(()=>
			{
				this.deactivate()
				res()
			}, fade_rate_s*1000)
		})
	}
}

export { RegLoading }