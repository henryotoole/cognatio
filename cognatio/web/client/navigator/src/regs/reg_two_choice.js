/**
 * @file A re-skinned region two choice
 * @author Josh Reed
 */

import { RegTwoChoice, Fabricator } from "../lib/regional.js";

class RegTwoChoiceNav extends RegTwoChoice
{
	fab_get()
	{
		let css = /* css */`
			[rfm_reg="RegTwoChoiceNav"] {
				& .cont
				{
					max-width: 30em;
					color: var(--punchcard-beige-darker);
					border-radius: 5px;
					overflow: hidden;
					border: 1px solid var(--punchcard-beige-darker);

					font-family: "IBM Mono";
				}
				& .text
				{
					padding-bottom: 0.5em;
					padding-left: 0.5em;
					padding-right: 0.5em;
				}
				& .row
				{
					display: flex; flex-direction: row; justify-content: space-between;
				}
				& button
				{
					margin: 0.5em;
				}
			}
		`
		let html = /* html */`
			<punchcard>
				<div rfm_member='cont' class='cont background'>
					<div rfm_member="title" class='line-title'>Title</div>
					<div rfm_member="text" class='text'>Text</div>
					<div class='row'>
						<button class='button' rfm_member="deny"> Deny </button>
						<div style="width: 5em"></div>
						<button class='button' rfm_member="confirm"> Confirm </button>
					</div>
				</div>
			</punchcard>
		`
		return new Fabricator(html).add_css_rule(css)
	}
}

export { RegTwoChoiceNav }