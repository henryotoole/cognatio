/**
 * @file Contains an ethereal region for creating a new page resource (file)
 * @author Josh Reed
 */

import {Region, Fabricator, RHElement, RegInInput} from "../../regional/regional.js"
import {RegSWNav, RegNewPage} from "../nav.js"

class RegResourceNew extends Region
{
	fab_get()
	{
		let css = /* css */`
			[rfm_reg="RegResourceNew"] {
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
				& .file-cont {
					cursor: pointer;
				}
				& .file-input {
					display: none;
				}
				& .prog-row {
					display: flex; flex-direction: row;
				}
				& .prog-bar {
					color: var(--red);
					font-family: "IBM Mono";
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
						<div> COG NEW RESOURCE INSTRUCTION CARD </div>
						<button rfm_member="close" class='button'> X </button>
					</div>
					<div class='cont-mid'>
						<div class='line underline'>
							<div style='margin-right: 0.5em;'>Upload Name: </div>
							<label rfm_member='regin_filename_cont' style='flex-grow: 1'></label>
						</div>
						<div class='line underline'>
							<div rfm_member='prog_row' class='prog-row'>
								Uploading: [<span rfm_member='prog_bar' class='prog-bar'></span>] (
								<span rfm_member='prog_pct'></span>)%
							</div>
						</div>
						<div class='line' style='margin-right: 1em'>
							<div class='underline' style='margin-right: 1em'> Attach File: </div>
							<div rfm_member='file_cont' class='file-cont'>
								<input type="file" rfm_member="file_input" class='file-input'>
								<button rfm_member='file_button' class='button'>>> Select File</button>
							</div>
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
	/** @type {RHElement} */
	close
	/** @type {RHElement} */
	filename
	/** @type {RHElement} */
	error
	/** @type {RHElement} */
	send
	/** @type {RHElement} */
	send
	/** @type {RHElement} */
	file_cont
	/** @type {RHElement} */
	file_input
	/** @type {RHElement} */
	file_button
	/** @type {RHElement} */
	prog_row
	/** @type {RHElement} */
	prog_bar
	/** @type {RHElement} */
	prog_pct

	settings = {
		filename: undefined,
		/** @description Read-only file as selected in input. */
		file: undefined,
		/** @description Float between 0 and 1 that represents upload progress. Undefined if none in progress */
		progress: undefined,
	}

	_create_subregions()
	{
		this.regin_filename = new RegInInput().fab().link(this, this.regin_filename_cont, this.settings, "filename")
		this.regin_filename.member_get("input").setAttribute("placeholder", "No file selected...")
		this.regin_filename.member_get("input").style.width = "100%"
		// Forward the click from the container to the hidden input.
		this.file_cont.addEventListener('click', ()=>{this.file_input.click()})
		this.file_input.addEventListener('change', ()=>
		{
			this.settings.file = this.file_input.files[0]
			this.settings.filename = this.settings.file.name
			this.render()
		})
	}

	_on_link_post()
	{
		this.close.addEventListener('click', ()=>{this.deactivate()})
		this.send.addEventListener('click', ()=>{this.upload_file()})
	}

	/**
	 * Upload a new file object as interpreted from the settings of this region.
	 * 
	 * @returns {Promise} That resolves when file is uploaded.
	 */
	async upload_file()
	{
		this.settings.error = undefined
		return new Promise((res, rej)=>
		{
			let reg = /^[a-zA-Z0-9_.]*$/, name = this.settings.filename
			if(name == undefined || name.length == 0)	{
				name = undefined
			}
			else if(name.search(reg) == -1)
			{
				this.settings.error = "ERROR: Name must be alphanumeric and contain no spaces."
			}
			if(this.swyd.dh_page_resource.get_all_ids().indexOf(name) != -1)
			{
				this.settings.error = "ERROR: Filename is already taken and must be unique."
			}
			if(this.settings.file == undefined)
			{
				this.settings.error = "ERROR: Must select a file to upload."
			}

			this.render()

			// If any errors, reject
			if(this.settings.error)
			{
				rej()
				return
			}

			let prog_update = (prog)=>{
				this.settings.progress = prog
				this.render()
			}
			
			this.swyd.dh_page_resource.create(name, this.settings.file, prog_update).then(()=>
			{
				this.swyd.render()
				this.deactivate()
				res()
			})
		})
	}

	_on_settings_refresh()
	{
		this.settings.filename = "No file selected..."
		this.settings.progress = undefined
	}

	_on_render()
	{
		// Punchrow
		let fwd_data = [this.settings.filename]
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

		// File on-disk name
		if(this.settings.file != undefined)
		{
			this.file_button.text(`[${this.settings.file.name}]`)
		}
		else
		{
			this.file_button.text(">> Select File")
		}

		// Render progress if relevant
		this.prog_row.hide()
		if(this.settings.progress != undefined)
		{
			this.prog_row.show()
			
			let n = 20
			let txt = ""
			for(let i = 0; i < n; i++)
			{
				txt += i < (this.settings.progress * n) ? "*" : " "
			}
			this.prog_bar.text(txt)
			this.prog_pct.text(Math.round(this.settings.progress * 100))
		}
	}
}

export { RegResourceNew }