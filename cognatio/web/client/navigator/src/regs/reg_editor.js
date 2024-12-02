/**
 * @file A region for the Page editor. This is a code/text editor.
 * @author Josh Reed
 */

import { Region, Fabricator, RHElement, RegInTextArea } from "../lib/regional.js"
import { RegSWNav } from "../nav.js"

/**
 * The editor region contains a field with code shown and editable.
 */
class RegEditor extends Region
{
	fab_get()
	{
		// Note that the toplevel nesting selector matches attribute rfm_reg="RegViewport". This attribute is
		// automatically added to regions' reg element when they are linked.
		let css = /* css */`
			[rfm_reg="RegEditor"] {
				/* This positions the lectern and containing papers to the correct location. */
				& .cont-lectern {
					box-sizing: border-box;
					position: relative;
					width: 100%; height: 100%;

					display: flex; flex-direction: column;
					justify-content: center;

					background-color: var(--brass-light);
					border-left: 2px solid var(--brass-dark);
					border-bottom: 2px solid var(--brass-dark);
					border-top: 2px solid var(--brass-dark);

					transition: 1s;
				}
				/* This container will always nestle into the lectern properly. */
				& .cont-papers {
					box-sizing: border-box;
					width: 100%;
					
					flex-grow: 1;

					display: flex;
					flex-direction: column;
					align-items: flex-start;
					justify-content: center;

					padding-right: 1em;
					padding-left: 1em;
					padding-top: 0.5em;
				}
				& .cont-editor {
					position: relative;
					box-sizing: border-box;
					width: 100%;

					flex-grow: 1;
					
					border: 1px solid black;
					padding-left: 2em;
					padding-top: 2em;
					padding-bottom: 1em;
					border-bottom: none;

					background-color: var(--white-off);
					overflow: hidden;
				}
				& .lectern-base {
					box-sizing: border-box;
					width: calc(100% - 1em);
					height: 0.5em;
					margin-bottom: .5em;
					margin-left: 0.5em;
					margin-right: 0.5em;

					background-color: var(--brass-lightest);
					border: 1px solid var(--metal-blue-dark);
					border-radius: 0.5em;
				}
				& .row {
					display: flex; flex-direction: row;
				}
				& .red-line {
					position: absolute;
					top: 0; left: 0;
					background-color: transparent;
					pointer-events: none;
				}
				& .red-line.top {
					width: 100%; height: 2em;
					border-bottom: 1px solid  var(--red-light);
				}
				& .red-line.left {
					width: 2em; height: 100%;
					border-right: 1px solid  var(--red-light);
				}
				/* Modify the regin text area */
				textarea {
					border: none;
					white-space: pre;
					font-family: "IBMPlexMono";
					font-size: 0.8em;
					background-color: var(--white-off);
				}
				textarea:focus {
					outline: none;
				}
				textarea.wrap-bound {
					text-wrap: wrap;
					width: auto;
				}
				& .ruler-row {
					position: absolute;
					top: 1em; left: 2em;
					height: 1em;

					display: flex; flex-direction: row;
					justify-content: center;
				}
				& .ruler-label {
					color: var(--red-light);
					font-family: "IBMPlexMono";
					font-size: 0.7em;
					padding-left: 0.2em;
					cursor: pointer;
				}
				& .ruler-label:hover {
					text-decoration: underline;
				}
				& .ruler {
					user-select: none;
					pointer-events: none;
					padding: 0px;
					resize: none;

					height: 100%;
					
					border-right: 1px solid  var(--red-light);
					background-color: transparent;
				}
				& .ribbon {
					position: relative;
					box-sizing: border-box;
					margin-left: 0.5em;
					padding: 0.25em;

					border: 1px solid var(--metal-dark);
					border-bottom: none;
					border-top-left-radius: 0.25em;
					border-top-right-radius: 0.25em;

					color: white;
					font-weight: 500;
					background-color: var(--red);

					transition: 0.5s;
				}
				& .ribbon.collapsed {
					transform: translate(0, 1.25em);
					transition: 0.5s;
				}
				& .ribbon-sc {
					text-decoration: wavy underline;
				}
			}
		`
		let html = /* html */`
			<div class='cont-lectern'>
				<div rfm_member='cont_papers' class='cont-papers'>
					<div class='row' style='justify-content: space-between; width: 100%;'>
						<div class='row'>
							<button rfm_member='btn_apply' class='ribbon collapsed'> Apply </button>
							<button rfm_member='btn_upload' class='ribbon collapsed'> Upload </button>
						</div>
						<div class='row' style='margin-right: 0.5em'>
							<button rfm_member='btn_spellcheck' class='ribbon collapsed ribbon-sc'> SC </button>
						</div>
					</div>
					<div rfm_member='cont_editor' class='cont-editor'>
						<div class='ruler-row'>
							<textarea class='ruler' cols=115></textarea>
							<div rfm_member='ruler_115' class='ruler-label'>115</div>
						</div>
						<div class='ruler-row'>
							<textarea class='ruler' cols=80></textarea>
							<div rfm_member='ruler_80' class='ruler-label'>80</div>
						</div>
						<div class='red-line left'></div>
						<div class='red-line top'></div>
						<div rfm_member='loading_layer' class='cog-loading-layer'>
							<div class='cog-loader'></div>
						</div>
					</div>
				</div>
				<div class='lectern-base'></div>
			</div>
		`
		return new Fabricator(html).add_css_rule(css)
	}

	settings = {
		/** @description The last URL that this editor had its code loaded for. */
		page_id_loaded_for: undefined,
		/** @description Local copy of the 'code' for the currently loaded page. Will change as user edits. */
		local_code: undefined,
		/** @description Ruler offset in characters, or undefined to disable. Sets a hard word wrap */
		ruler_offset: undefined,
	}

	/** @type {RegSWNav} Reference to the switchyard region. */
	swyd
	/** @type {RHElement} */
	cont_editor
	/** @type {RHElement} */
	cont_papers
	/** @type {RHElement} */
	btn_apply
	/** @type {RHElement} */
	btn_upload
	/** @type {RHElement} */
	ruler_80
	/** @type {RHElement} */
	ruler_115
	/** @type {RegInTextArea} */
	editor

	_create_subregions()
	{
		this.editor = new RegInTextArea().fab().link(this, this.cont_editor, this.settings, "local_code")
	}

	_on_link_post()
	{
		this.datahandler_subscribe(this.swyd.dh_page_content)
		this.render_checksum_add_tracked('loading', ()=>{return this.swyd.settings.page_loading})

		this.btn_apply.addEventListener("click", ()=>{this.code_apply()})
		this.btn_upload.addEventListener("click", ()=>{this.code_upload()})
		this.btn_spellcheck.addEventListener("click", ()=>{this.spellcheck_toggle()})

		// Bind special key events
		this.editor.textarea.addEventListener("keydown", (e)=>
		{
			if(e.ctrlKey && e.code == "KeyS")
			{
				// Don't try to save the web-page.
				e.preventDefault()
				this.code_upload()
			}

			if(e.ctrlKey && e.code == "KeyD")
			{
				// Don't try to save the web-page.
				e.preventDefault()
				this.duplicate_line()
			}
		})

		this.ruler_80.addEventListener('click', ()=>{this.set_ruler(80)})
		this.ruler_115.addEventListener('click', ()=>{this.set_ruler(115)})
	}

	/**
	 * Get whether there are any unsaved changes in the editor field that would be lost if the editor was reset.
	 * 
	 * @returns {Boolean}
	 */
	get has_unsaved_changes()
	{
		return (this.settings.local_code != this.swyd.dh_page_content.get_src()) || this.swyd.dh_page_content.can_push()
	}

	/**
	 * Get whether or not there are unapplied changes in the editor that are not reflected in the viewport.
	 * 
	 * @returns {Boolean}
	 */
	get has_unapplied_changes()
	{
		return (this.settings.local_code != this.swyd.dh_page_content.get_src())
	}

	/**
	 * This is called every render to check whether or not the code for this region should be
	 * overwritten. Code is only overwritten *automatically* when the page URL changes.
	 */
	code_update()
	{
		// If there's no code or
		if((this.settings.local_code == undefined) || (this.settings.page_id_loaded_for != this.swyd.settings.page_id))
		{
			this.settings.local_code = this.swyd.dh_page_content.get_src()
			this.settings.page_id_loaded_for = this.swyd.settings.page_id
			this.render()
		}
	}

	/**
	 * This is called to apply the current code in the editor to the Viewport's IFrame. This renders it, after
	 * a fashion, so that it may be observed. This does NOT send the new code to the server, however.
	 */
	code_apply()
	{
		this.swyd.dh_page_content.set_src(this.settings.local_code)
		this.swyd.render()
	}

	/**
	 * Call this to send the current local code to the server. An update of local code will trigger a graph
	 * network refresh for this page, so we need to refresh the following datahandlers:
	 * dh_page - Mass might have changed
	 * dh_edge - Edges might have had strengths updated, or new ones might exist. Deletions not possible currently.
	 * 
	 * @returns {Promise} Promise to resolve when server is updated and datahandler's match up.
	 */
	async code_upload()
	{
		this.code_apply()
		return new Promise((res, rej)=>
		{
			this.swyd.dh_page_content.push().then(()=>
			{
				return this.swyd.dh_page.network_update_for_page(this.swyd.dh_edge, this.swyd.settings.page_id)
			}).then(()=>
			{
				this.swyd.render(true)
				res()
			}).catch((e)=>
			{
				this.swyd.prompt_login(e, "Page Alteration Not Authorized")
				throw(e)
			})
		})
	}

	/**
	 * Toggle whether spellcheck is on for the editor.
	 */
	spellcheck_toggle()
	{
		this.settings.spellcheck_on = !this.settings.spellcheck_on
		this.render()
		if(this.settings.spellcheck_on) 
		{
			this.editor.textarea.focus()
		}
	}

	/**
	 * Duplicate the line on which the cursor currently rests. If there's a range selected, nothing occurs.
	 */
	duplicate_line()
	{
		// NOTE: Odd wrapping is a requirement of how the base textarea keeps track of state for undo/redo
		// and regional VMC stuff.

		// Wrapping start
		let start = this.editor.textarea.selectionStart,
			end = this.editor.textarea.selectionEnd,
			textarea = this.editor.textarea,
			text = textarea.value
		if(start != end) return

		// Operate on text
		let line_start_i = RegInTextArea._text_get_selected_lines(text, start, end)[0]
		let line_end_i = text.indexOf("\n", line_start_i)
		let line = text.substring(line_start_i, line_end_i)
		text = text.substring(0, line_end_i) + "\n" + line + text.substring(line_end_i)

		// Wrapping end
		textarea.value = text
		textarea.selectionStart = start
		textarea.selectionEnd = end
		this.editor._view_alters_value(textarea.value)
	}

	/**
	 * Set the hard, word-wrap enforcing ruler for the editor textarea.
	 * 
	 * @param {Number} n_chars Number of chars
	 */
	set_ruler(n_chars)
	{
		if(this.settings.ruler_offset == n_chars)
		{
			this.settings.ruler_offset = undefined
		}
		else
		{
			this.settings.ruler_offset = n_chars
		}
		this.render()
	}

	_on_settings_refresh()
	{
		this.settings.page_id_loaded_for = undefined
		this.settings.local_code = this.swyd.dh_page_content.get_src()
		this.settings.spellcheck_on = false
	}
	
	_on_render()
	{
		if(this.swyd.dh_page_content.get_src() != undefined) {this.code_update()}
		let upload_name = this.has_unsaved_changes ? "Upload" : "Upload"
		this.btn_upload.text(upload_name)
		this.btn_apply.class_set('collapsed', !this.has_unapplied_changes)
		this.btn_upload.class_set('collapsed', !this.has_unsaved_changes)
		
		// Loading state.
		this.loading_layer.style.opacity = this.swyd.settings.page_loading ? "35%" : ""

		// Ruler offset
		if(this.settings.ruler_offset == undefined)
		{
			this.editor.textarea.removeAttribute('cols')
			this.editor.textarea.classList.remove('wrap-bound')
		}
		else
		{
			this.editor.textarea.setAttribute('cols', this.settings.ruler_offset)
			this.editor.textarea.classList.add('wrap-bound')
		}

		// Spellcheck
		this.btn_spellcheck.class_set('collapsed', !this.settings.spellcheck_on)
		this.editor.textarea.setAttribute('spellcheck', this.settings.spellcheck_on)
	}

}

export {RegEditor}