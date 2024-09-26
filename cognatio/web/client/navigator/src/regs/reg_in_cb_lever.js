/**
 * @file Class for a RegIn that wraps a checkbox <input> tag as a rotating lever.
 * @author Josh Reed
 */

import { RegInCheckbox, RHElement, Fabricator } from "../lib/regional.js"

/**
 * This behaves the same as RegInCheckbox, except the HTML/CSS has been overhauled to give it a certain
 * flavor. It will appear as one of those gearbox levers on the side of a lathe.
 */
class RegInCBLever extends RegInCheckbox
{
	/** @type {RHElement} The input with type="checkbox" */
	checkbox
	/** @type {RHElement} The input container <div> */
	cont
	/** @type {RHElement} The container for the lever that turns. */
	lever
	/** @type {RHElement} The little light to the right of the lever */
	light

	fab_get()
	{
		let css = /* css */`
			[rfm_reg="RegInCBLever"] {
				/* This toplevel cont should always be square, with 100% rmargin and 50% lmargin. */
				& .cont {
					position: relative;
					width: 2em; height: 2em;
					background-color: transparent;
					margin-right: 2em;
					margin-left: 1em;
				}
				& .checkbox {
					position: absolute;
					all: unset;
				}
				& .lever {
					position: absolute;
					width: 100%; height: 100%;
					top: 0%;
					transition: .5s;
					display: flex; align-items: center; justify-content: center;
					cursor: pointer;
					border-radius: 50%;
				}
				& .lever .hub {
					position: absolute;
					box-sizing: border-box;
					width: 100%; height: 100%;
					border-radius: 50%;
					background-color: var(--metal-blue);
					border: 1px solid var(--metal-blue-dark);

					display: flex; align-items: center; justify-content: center;
				}
				& .lever .hub-inner {
					position: absolute;
					box-sizing: border-box;
					width: 80%; height: 80%;
					border-radius: 50%;
					background-color: var(--metal-blue-light);
					border: 1px solid var(--metal-blue-dark);
				}
				& .lever .post {
					box-sizing: border-box;
					position: absolute;
					right: 90%; top: 40%;
					width: 40%; height: 20%;
					border-top-right-radius: 10% 50%;
					border-bottom-right-radius: 10% 50%;
					background-color: var(--metal-blue-light);
					border: 1px solid var(--metal-blue-dark);
				}
				& .lever .ball {
					box-sizing: border-box;
					position: absolute;
					left: -50%; top: 38%;
					width: 24%; height: 24%;
					border-radius: 50%;
					background-color: var(--metal-blue-light);
					border: 1px solid var(--metal-blue-dark);
				}
				& .light-socket {
					position: absolute;
					left: 125%; top: 25%;
					width: 50%; height: 50%;
					background-color: var(--metal-grey);
					border-radius: 50%;

					display: flex; align-items: center; justify-content: center;
				}
				& .light {
					width: 50%; height: 50%;
					background-color: var(--metal-grey);
					border-radius: 50%;
				}
				& input:checked + .lever {
					transform: rotate(135deg);
					transition-timing-function: cubic-bezier(.56,.19,.86,.62);
				}
				& input:checked ~ .light-socket > .light {
					background-color: var(--green);
				}
			}
		`
		// Note, must be within a <label> for animations to work for some reason.
		let html = /* html */`
			<label>
				<div rfm_member="cont" class="cont">
					<input rfm_member="checkbox" class="checkbox" type="checkbox">
					<div rfm_member="lever" class="lever">
						<div class="hub">
							<div class="hub-inner"></div>
						</div>
						<div class="post"></div>
						<div class="ball"></div>
					</div>
					<div class='light-socket'>
						<div class='light' rfm_member='light'></div>
					</div>
				</div>
			</label>
		`
		return new Fabricator(html).add_css_rule(css)
	}
}

export {RegInCBLever}