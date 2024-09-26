/**
 * @file The region that holds the resources interface for a page
 * @author Josh Reed
 */

import { Region, Fabricator, RHElement } from "../lib/regional.js"
import { RegSWNav, CompFile } from "../nav.js"

/**
 * The resources region below the main viewport and editor.
 */
class RegResources extends Region
{
	fab_get()
	{
		// overall container has fixed width but content-dynamic height.
		let css = /* css */`
			[rfm_reg="RegResources"] {
				& .cont-main {
					box-sizing: border-box;
					width: 100%;

					display: flex; flex-direction: column;
					justify-content: center;
					
					border-top: 5px solid var(--metal-blue-dark);
					background-color: var(--metal-blue);
				}
				& .cont-exterior {
					box-sizing: border-box;
					width: 100%;
					height: 100%;
					padding-left: 1.5em; padding-right: 1.5em;
					
					display: flex; flex-direction: column;
					justify-content: center;
				}
				& .cont-arched {
					box-sizing: border-box;
					width: 100%;
					height: 100%;

					border: 5px solid var(--metal-blue-dark);
					border-top-left-radius: 5em;
					border-top-right-radius: 5em;
					border-bottom: none;

					overflow: hidden;
				}
				& .cont-scrolling {
					width: 100%; height: 100%;
					overflow: scroll;
					max-height: 50vh;
				}
				& .cont-files {
					width: 100%;
					display: flex; flex-direction: row;
					justify-content: center;
					flex-wrap: wrap;
				}
				& .bolt-row {
					display: flex; flex-direction: row;
					justify-content: space-between;
					box-sizing: border-box;
					width: 100%;
				}
				& .bolt {
					margin: 0.5em;
					width: 0.5em;
					height: 0.5em;
					border-radius: 0.5em;
					background-color: var(--metal-blue-light);
					border: 0.18em solid var(--metal-blue-dark);
				}
			}
		`
		let html = /* html */`
		<div class="cont-main">
			<div class='bolt-row'>
				<div class='bolt'></div><div class='bolt'></div><div class='bolt'></div><div class='bolt'></div>
				<div class='bolt'></div><div class='bolt'></div><div class='bolt'></div><div class='bolt'></div>
				<div class='bolt'></div><div class='bolt'></div><div class='bolt'></div><div class='bolt'></div>
				<div class='bolt'></div><div class='bolt'></div><div class='bolt'></div><div class='bolt'></div>
			</div>
			<div class='cont-exterior'>
				<div class='cont-arched'>
					<div class='cont-scrolling'>
						<div rfm_member='cont_files' class='cont-files'>
						</div>
					</div>
				</div>
			</div>
		</div>
		`
		return new Fabricator(html).add_css_rule(css)
	}

	settings = {
	}

	/** @type {RegSWNav} Reference to the switchyard region. */
	swyd
	/** @type {RHElement} */
	cont_files

	_create_subregions()
	{
		
	}

	_on_link_post()
	{
		this.datahandler_subscribe([this.swyd.dh_page_resource])
		this.render_checksum_add_tracked('cont_files_width', ()=>
		{
			return this.cont_files.clientWidth
		})
	}

	_on_settings_refresh()
	{
	}
	
	_on_render()
	{
		this.cont_files.empty()
		if(this.swyd.settings.page_id == undefined)
		{
			// Put any no-page specific stuff here.
		}
		else
		{
			let resource_ids = this.swyd.dh_page_resource.get_all_ids()
			resource_ids.forEach((filename)=>
			{
				this.cont_files.append(
					this._draw_file(
						this.swyd.dh_page_resource.comp_get(filename)
					)
				)
			})
			let el_new_file = this._draw_file_new()
			this.cont_files.append(el_new_file)

			// Compute the number of cont's in a row
			let n_row = Math.floor(this.cont_files.clientWidth / el_new_file.dims_outer().x)
			// Then see how many are needed to fill the last row
			let n_last_row = this.cont_files.children.length % n_row
			let n_needed = n_row - n_last_row
			if(n_last_row == 0) n_needed = 0
			for(let i = 0; i < n_needed; i++)
			{
				this.cont_files.append(this._draw_file_ballast())
			}
		}
		
	}

	/**
	 * Draw a representation of a file.
	 * 
	 * @param {CompFile} cfile 
	 * 
	 * @returns {RHElement} An element ready to be dropped into place with all event handlers bound.
	 */
	_draw_file(cfile)
	{
		// Reminder to self that calling add_css_rule() many times has collision detection, so calling
		// _draw_file many times isn't cluttering up the DOM. However, the core selector is used for collision
		// so [rfm_reg="RegResources"] cannot be used here.
		let css = /* css */`
			filebox {
				box-sizing: border-box;
				display: flex; flex-direction: row;
				align-items: center;

				width: 24em; height: 7.5em;
				padding: 0.5em;
				margin: 0.5em;
				border-radius: 1em;

				background-color: var(--metal-light);
				border: 1px solid var(--metal-blue-dark);
				color: var(--dark);

				& .icon-cont {
					box-sizing: border-box;
					height: 6.5em;
					width: 6.5em;
					border-radius: 0.5em;
					overflow: hidden;

					border: 2px solid var(--metal-lighter);
				}
				& .icon {
					width: 100%;
					height: 100%;
					object-fit: contain;
					background-color: var(--metal-blue-dark);
				}
				& .label-cont {
					overflow: hidden;
					height: 5em;
					margin-left: 0.5em;
					margin-right: 0.5em;
					flex-grow: 1;
					border-radius: 5px;
					
					border: 1px solid var(--punchcard-beige-darker);
					background-color: var(--punchcard-beige-dark);
				}
				& .label {
					height: 4.5em;
					padding: 0.5em;
					padding-top: 0;
					margin-top: 0.5em;

					background-color: var(--punchcard-beige);
					border-top: 1px solid var(--punchcard-beige-darker);
				}
				& .label-row {
					position: relative;
					width: 100%;
					height: 1.333em;
					display: flex; flex-direction: row;
					align-items: flex-end;
					justify-content: space-between;

					font-family: "IBM Mono";
				}
				& .label-row.underline {
					border-bottom: 1px solid var(--punchcard-beige-darker);
				}
				& .label-filename-text {
					width: 100%;
					max-height: 2.7em;
					line-height: 1.37;
					position: absolute; top: 0; left: 0;
					font-family: "IBM Mono";
					text-wrap: wrap;
					word-wrap: break-word;
					overflow: hidden;
				}
				& .label-button {
					
				}
				& .label-button:hover {
					text-decoration: underline;
				}
			}
		`
		let html = /* html */`
		<filebox rfm_member='filebox'>
			<button class='icon-cont'>
				<img rfm_member='icon' class='icon'>
			</button>
			<div class='label-cont'>
				<div class='label'>
					<div class='label-row underline'>
						<div rfm_member='filename' class='label-filename-text'></div>
					</div>
					<div class='label-row underline'></div>
					<div class='label-row'>
						<button rfm_member='link' class='label-button'> >> Link</button>
						<button rfm_member='delete' class='label-button'> >> Delete</button>
					</div>
				</div>
			</div>
		</filebox>
		`
		let fab = new Fabricator(html).add_css_rule(css).fabricate()

		// Short-circuit to allow blanks with undefined comp
		// return fab.get_member("filebox")

		fab.get_member("filename").text(cfile.filename)
		fab.get_member("icon").setAttribute("src", cfile.icon_url)
		fab.get_member("link").addEventListener("click", ()=>
		{
			// Copy the link to clipboard
			// Won't work if not HTTPS : |
			let disp_word = "Copied"
			try
			{
				navigator.clipboard.writeText(cfile.data.url)
			}
			catch(e)
			{
				disp_word = "Error"
				console.warn("Can not copy to clipboard. Security reason?")
			}

			// Run a little animation to indicate that the click did something
			fab.get_member("link").text(`[${disp_word}]`)
			window.setTimeout(()=>
			{
				fab.get_member("link").text(">> Link")
			}, 500)
		})
		fab.get_member("delete").addEventListener("click", ()=>
		{
			this.swyd.reg_two_choice.present_choice(
				"Delete Resource",
				`Are you sure you want to permanently delete '${cfile.filename}'?`,
				"No", "Yes"
			).then(()=>
			{
				return this.swyd.dh_page_resource.delete(cfile.id)
			}).then(()=>
			{
				this.render()
			})
		})
		fab.get_member("icon").addEventListener("click", ()=>
		{
			this.render()
		})

		return fab.get_member("filebox")
	}

	/**
	 * Draw a container to indicate where a 'new file' can be created. This will look similar to the other
	 * file tags and piggybacks off of those file container's CSS.
	 * 
	 * @returns {RHElement} An element ready to be dropped into place with all event handlers bound.
	 */
	_draw_file_new()
	{
		let html = /* html */`
		<filebox rfm_member='filebox'>
			<button rfm_member='icon_cont' class='icon-cont'>
				<img rfm_member='icon' class='icon' src='/nav/assets/icons/file_upload.svg'>
			</button>
			<div class='label-cont'>
				<div class='label'>
					<div class='label-row underline'>
						<div rfm_member='filename' class='label-filename-text'></div>
					</div>
					<div class='label-row underline'></div>
					<div class='label-row'>
						<button rfm_member='create' class='label-button'> >> Create New</button>
					</div>
				</div>
			</div>
		</filebox>
		`
		let fab = new Fabricator(html).fabricate()
		let create = ()=>
		{
			this.swyd.reg_resource_new.activate()
		}

		fab.get_member("create").addEventListener("click", create)
		fab.get_member("icon").addEventListener("click", create)

		return fab.get_member("filebox")
	}

	/**
	 * Draw a 'ballast' container, that is, a container that is invisible and cannot be interacted with, but
	 * nonetheless takes up space.
	 * 
	 * @returns {RHElement} An element ready to be dropped into place
	 */
	_draw_file_ballast()
	{
		let html = /* html */`
		<filebox rfm_member='filebox' style='opacity: 0; pointer-events: none'>
			<button rfm_member='icon_cont' class='icon-cont'>
			</button>
			<div class='label-cont'>
			</div>
		</filebox>
		`
		let fab = new Fabricator(html).fabricate()
		return fab.get_member("filebox")
	}
}

export { RegResources }