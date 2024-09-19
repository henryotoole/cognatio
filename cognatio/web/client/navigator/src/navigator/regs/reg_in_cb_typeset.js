/**
 * @file A checkbox input that has a typeset look.
 * @author Josh Reed
 */

import { RegInCheckbox, Fabricator, RHElement } from "../../regional/regional.js";

class RegInCBTypeset extends RegInCheckbox
{
	/** @type {RHElement} The input with type="checkbox" */
	checkbox
	/** @type {RHElement} The input container <div> */
	cont
	/** @type {RHElement} The actual, visible marker of the input */
	visual_checkbox

	fab_get()
	{
		let css = /* css */`
			[rfm_reg="RegInCBTypeset"] {
				& .cont {
					position: relative;
					width: 100%; height: 100%;
					background-color: transparent;
					display: flex; align-items: center; justify-content: center;
				}
				& .checkbox {
					position: absolute;
					all: unset;
				}
				& input:checked + .check {
					display: flex;
				}
				& input:checked ~ .light-socket > .light {
					background-color: var(--green);
				}
				& .visual-checkbox {
					box-sizing: border-box;
					width: 100%; height: 100%;
					border: 1px solid var(--punchcard-beige-darker);
					cursor: pointer;
				}
				& .check {
					position: absolute;
					top: 20%;
					display: none;
					color: var(--red);
					font-size: 200%;
				}
			}
		`
		// Note, must be within a <label> for animations to work for some reason.
		let html = /* html */`
			<div rfm_member="cont" class="cont">
				<input rfm_member="checkbox" class="checkbox" type="checkbox">
				<div class="check">*</div>
				<div rfm_member="visual_checkbox" class="visual-checkbox">
				</div>
			</div>
		`
		return new Fabricator(html).add_css_rule(css)
	}
}


export {RegInCBTypeset}