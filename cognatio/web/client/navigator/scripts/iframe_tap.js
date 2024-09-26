/**
 * @file This contains a class and code to load it in the iframe. This file exists outside of the rest of the
 *       ES6 structure and cannot do imports, etc. This exists so that there's always a little bit of controllable
 *       code running in the iframe.
 * @author Josh Reed
 */

/**
 * One and only one instance of the tap will exist in the iframe at any given time. Right now, the tap provides
 * the following functionality:
 * 1. Communication hook that overrides link-click behavior and forwards those clicks to the nav.
 */
class IframeTap
{
	constructor()
	{
		this.setup_dom_change_listener()
		this.setup_override_all_links()
	}
	
	/**
	 * Call this to setup a mutation observer listener in the DOM of the iframe.
	 */
	setup_dom_change_listener()
	{
		let observer_body = new MutationObserver(this.on_dom_change.bind(this))
		if(document.body)
		{
			observer_body.observe(document.body, {childList: true, subtree: true})
		}
	}

	/**
	 * Called whenever the DOM is changed, by a script etc.
	 */
	on_dom_change(mutation_list, observer)
	{
		mutation_list.forEach((mutation_record)=>
		{
			mutation_record.addedNodes.forEach((added_node)=>
			{
				if(added_node.nodeName == "A" || added_node.nodeName == "LINK")
				{
					this.override_element_clickable_link(added_node)
				}
			})
		})
	}

	/**
	 * Override all links in the current iframe document to prevent default behavior and instead send a message
	 * to the nav that a link has been clicked. This should only be called once at startup and the mutation
	 * observer used to alter any that are added programatically later.
	 */
	setup_override_all_links()
	{
		let a_tags = document.getElementsByTagName("a")
		let link_tags = document.getElementsByTagName("link")
		for(let i = 0; i < a_tags.length; i++)
		{
			this.override_element_clickable_link(a_tags[i])
		}
		for(let i = 0; i < link_tags.length; i++)
		{
			this.override_element_clickable_link(link_tags[i])
		}
	}

	/**
	 * Override the click behavior of the provided element such that the link is not followed and the action
	 * to 'follow' the link is sent out in the form of a window event.
	 * @param {Element} el A DOM element
	 */
	override_element_clickable_link(el)
	{
		el.addEventListener('click', (e)=>
		{
			e.preventDefault()
			e.stopPropagation()

			let event = new CustomEvent('iframe_href_nav', {
				detail: {
					'link': el.getAttribute('href')
				}
			})
			// Note: this will probably trigger a security error if a cross-origin page is loaded.
			window.parent.document.dispatchEvent(event)
		})
	}
}

const iframe_tap = new IframeTap()