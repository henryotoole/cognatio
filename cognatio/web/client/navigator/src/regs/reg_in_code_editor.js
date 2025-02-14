/**
 * @file Class for a RegIn that wraps a <div> to make a full-function custom text editor.
 * @author Josh Reed
 */

import { RegIn, Fabricator, RHElement } from "../lib/regional.js"
import { LineMap } from "../nav.js"

/**
 * A custom code highlighter and editor for me. I have some odd requirements for how I wish this to work
 * that I don't think can be found off-the-shelf in a library.
 * 
 * Some definitions:
 * 1. Written-text index: The index within the overall stream of text as it is written on the page. Tabs can
 * 
 * Some assumptions / constraints that make this much easier:
 * 1. Font **must** be unispace or this won't work.
 */
class RegInCodeEditor extends RegIn
{
	/** @type {RHElement} The main container element for this region */
	main
	/** @type {RHElement} Contains vertical column of lines */
	lines
	/** @type {RHElement} A little blank bit of text to measure */
	blank

	/** @description Settings object for this region. This is local data which is erased on page refresh. */
	settings = {
		/** @description Whether or not the use is clicking-and-dragging to select text. */
		selecting: undefined,
		/** @description The index of the cursor, or selection start if there's more than one character selected. */
		cursor_start: 0,
		/** @description The index of the end of the selection, or simply cursor position if no selection. */
		cursor_end: 0,
		/** @description Tab width in spaces */
		tab_width: 4,
		/** @description Word wrap condition. A width if enabled, or undefined if not */
		word_wrap_width: undefined,
		/** @type {LineMap} */
		_line_map: undefined,
		/** @description The text contained in this editor. */
		value: undefined
	}

	fab_get()
	{
		let css = /* css */`
			[rfm_reg="RegInCodeEditor"] {
				& .main {
					cursor: text;
				}
				& .lines {
					display: flex;
					flex-direction: column;
				}
				& .line {
					border-bottom: 1px solid red;
				}
				& .char {
					width: auto;
					white-space: nowrap;
					padding: 0;
					margin: 0;
					letter-spacing: 0px;
					word-spacing: 0px;
				}
				& .tab {
					/* Width set at construction */
				}
				& .cursor-outer {
					height: 1em;
					width: 0;
					position: relative;
				}
				& .cursor {
					height: 1em;
					width: 1px;
					position: absolute;
					background-color: maroon;
				}
				& .blank {
					visibility: hidden;
					position: absolute;
				}
			}
		`
		let html = /* html */`
			<div rfm_member='main' class='main'>
				<span rfm_member='blank' class='blank char'>A</span>
				<div rfm_member='lines' class='lines'>

				</div>
			</div>
		`
		return new Fabricator(html).add_css_rule(css)
	}

	/**
	 * This is called after linking is complete. It is used here to bind events.
	 */
	_on_link_post()
	{
		// Capture events
		this.input.addEventListener("keydown", (e) => {
			this._interpret_input_action(this.input.value);
		});
	}

	/**
	 * This is called any time that a user-instigated action causes a change to the model. It will ultimately
	 * call _view_alters_value(), but it interprets both current state and action taken to compute what the new
	 * value ought to be.
	 * 
	 * For example, if the 'a' key is pressed when text is selected, the selected text should be deleted and
	 * replaced with the 'a' key. This must be done **before** changing the value by interpreting state at the
	 * time of keypress.
	 * 
	 * @param {KeyboardEvent} e The event fired by the 'keydown' action.
	 */
	_interpret_input_key_action(e)
	{

	}

	/**
	 * Called when the mousedown event happens and this editor is focused. This starts a selection 'event'.
	 * 
	 * @param {MouseEvent} e Resulting event
	 */
	_interpret_input_mousedown_action(e)
	{

	}

	/**
	 * Called when the mousemove event happens and this editor is focused. This alters current selection, if
	 * the mouse is being held down. It always moves the cursor start position to the location clicked.
	 * 
	 * @param {MouseEvent} e Resulting event
	 */
	_interpret_input_mousemove_action(e)
	{

	}

	/**
	 * Called when the mouseup event happens and this editor is focused. This ends a selection 'event'.
	 * 
	 * @param {MouseEvent} e Resulting event
	 */
	_interpret_input_mouseup_action(e)
	{

	}

	/**
	 * Convert coordinate from pixel XY from top left corner into 'text' units of character-from-left and
	 * lines-from-top.
	 * 
	 * @param {Number} x X-coordinate in pixels
	 * @param {Number} y Y-coordinate in pixels
	 * @returns {Object} {x: in characters, y: in lines} The resulting position in 'text' units
	 */
	_util_xy_to_text_pos(x, y)
	{
		// TODO
	}

	/**
	 * Convert coordinate from 'text' units of character-from-left and lines-from-top into the actual index
	 * within the linear text that it corresponds to.
	 * 
	 * @param {Number} x X-coordinate in characters from left side
	 * @param {Number} y Y-coordinate in lines from top
	 * @returns {Object} Index in actual contained text
	 */
	_util_text_pos_to_index(x, y)
	{
		// TODO
	}

	/**
	 * Measures a hidden span to get character width by measuring an actual snippet of hidden text in the
	 * editor.
	 * 
	 * @returns {Number} The width of a single character under the styling of this main container, in pixels
	 */
	_util_get_char_width()
	{
		return this.blank.getBoundingClientRect().width
	}

	/**
	 * Measures what line height should be given the css applied to this region's main container.
	 * 
	 * @returns {Number} The line height, in pixels
	 */
	_util_get_line_height()
	{
		return this.blank.getBoundingClientRect().height
	}

	_on_settings_refresh()
	{
		super._on_settings_refresh()
		this.settings.selecting = false
		this.settings.cursor_start = 0
		this.settings.cursor_end = 0
		this.settings.value = ""
		this.settings.word_wrap_width = undefined
		this.settings._line_map = new LineMap()
	}

	_on_render()
	{
		// Decompose full text into correct lines
		this.settings._line_map.text_laminate(this.settings.value, this.settings.word_wrap_width)

		// Re-render lines
		this.lines.empty()
		let iwt_first = 0
		this._text_to_lines(this.settings._line_map.lines_simple).forEach((line_text)=>
		{
			this.lines.append(this._render_line(line_text, iwt_first))
			iwt_first += line_text.length
		})
	}

	/**
	 * @returns {RHElement} generate a new 'tab' object.
	 */
	_render_tab()
	{
		el = document.createElement('span')
		el = RHElement.wrap(el)
		el.classList.add('tab')
		el.style.width = this.settings.tab_width * this._util_get_char_width()
		return el
	}

	/**
	 * Create a line from the provided text
	 * 
	 * @param {Number} iwt_first The written-text index of the first character of this line.
	 * @param {String} text Text that the line is composed of. Should not contain newlines.
	 * 
	 * @returns {RHElement} generate a new 'line' container.
	 */
	_render_line(text, iv_first)
	{
		el = document.createElement('span')
		el = RHElement.wrap(el)
		el.classList.add('line')

		for(let i = 0; i < text; i++)
		{
			let c = text[i]
			let next_char;
			if(c == "\t")
			{
				next_char = this._render_tab()
			}
			else if(c == "\n")
			{
				throw("Newlines not acceptable here.")
			}
			else
			{
				next_char = document.createElement('span')
				el = RHElement.wrap(el)
				el.classList.add('char')
			}
			el.append(next_char)
		}

		return el
	}
}

export {RegInCodeEditor}