/**
 * @file This holds a region with drawings and updating mechanisms for rending a Network as a constellation.
 * @author Josh Reed
 */

import { Network, Vector2D } from "../nav.js";
import { Region, Fabricator, RHElement, linterp } from "../lib/regional.js";

/**
 * This region renders a 'constellation' in the style of Flamsteed's star charts. To do this, it uses Networks
 * and other methods.
 * 
 * The internal rendering portion of this region is pretty interesting / unusual. It's not really intended
 * to be re-rendered once it is being shown (as that would reset various animations). Instead, to achieve
 * graphical changes, direct access to in-memory stored references to DOM elements is used. This is, at least
 * for now, a novel approach.
 * 
 * **On Usage**
 * Use this by embedding it within a 'viewport'. This will take the size and shape of its parent region. The
 * general-purpose "origin" of the system for the constellation will be the center of the parent.
 * 
 * **TODO**
 * In reality, this class is still bit of a mess. It should really be two separate instances of some region
 * that renders a single-origin system. Then these would be combined at in a super-region to form what you
 * actually get when the constellation is rendered. *Even better*, those would use a base-level Network rendering
 * region that properly caches references to nodes, etc.
 * 
 * Most trickily, it will need to be more or less easy to adjust the classes and even the structure of the
 * resulting region instance without subclassing the entire region. This info could be stored in settings keys,
 * except they'd get reset. Perhaps, rather, they belong as instantiation args. I am not sure.
 * 
 * Sadly, I'm out of time now and can not pursure this line of enquiry.
 */
class RegConstellation extends Region
{
	fab_get()
	{
		let css = /* css */`
			[rfm_reg="RegConstellation"] {
				& .cont-outer {
					position: relative;
					top: 0; left: 0;
					width: 100%; height: 100%;
					
					background-color: var(--white-off);
				}
				& .frame {
					position: absolute;
					width: 0; height: 0;
					background-color: transparent;
				}
				& .constellation {
					position: absolute;
					width: 0; height: 0;
					background-color: transparent;
				}
				& .polar-frame {
					position: absolute;
					width: 0; height: 0;
					left: 0px; height: 0px;
					background-color: transparent;
				}
				& .ring {
					position: absolute;
					box-sizing: border-box;
					border: 1px;
				}
				& .point {
					position: absolute;
					width: 0px; height: 0px;
					top: 0px; left: 0px;
				}
				& .radial-line {
					position: absolute;
					box-sizing: border-box;
					border-top-width: 1px;
					border-right-width: 0px;
					border-left-width: 0px;
					border-bottom-width: 0px;
					height: 0px;
					top: 0.5px;
				}
				& .radial-text {
					position: absolute;
					overflow: visible;
				}
				& .frame-border-dashed {
					border-color: var(--metal-light);
					border-style: dashed;
					opacity: 70%;
				}
				& .frame-border-red {
					border-color: var(--red);
					border-style: solid;
					opacity: 70%;
				}
				& .star-major {
					position: absolute;
					background-color: var(--dark);
				}
				& .edge {
					background-color: var(--metal-light);
					height: 1px;
					left: 0px;
					position: absolute;
				}
				& .rotate-slow {
					animation: rotation_cw 300s infinite linear;
				}
				& .rotate-slower {
					animation: rotation_ccw 600s infinite linear;
				}
				& .text-title {
					font-size: 35px;
					font-family: "IBMPlexMono";
				}
			}
		`
		let css_rotate_cw = /* css */`
			@keyframes rotation_cw {
				from {
					transform: rotate(0deg);
				}
				to {
					transform: rotate(359deg);
				}
			}
		`
		let css_rotate_ccw = /* css */`
			@keyframes rotation_ccw {
				from {
					transform: rotate(359deg);
				}
				to {
					transform: rotate(0deg);
				}
			}
		`
		let html = /* html */`
			<div rfm_member='cont_outer' class='cont-outer'>
				<div class='frame rotate-slow' style='left: 50%; top: 50%'>
					<div class='frame rotate-slower'>
						<div rfm_member='const_offset' class='constellation rotate-slower' style='left: 35vw;'></div>
						<div rfm_member='frame_offset' class='constellation rotate-slower' style='left: 35vw;'></div>
					</div>
					<div rfm_member='frame_center' class='constellation'></div>
					<div rfm_member='const_center' class='constellation'></div>
				</div>
			</div>
		`
		return new Fabricator(html).add_css_rule(css).add_css_rule(css_rotate_cw).add_css_rule(css_rotate_ccw)
	}
	
	/** @type {RegSWNav} Reference to the switchyard region. */
	swyd
	/** @type {RHElement} */
	cont_outer
	/** @type {RHElement} */
	const_center
	/** @type {RHElement} */
	const_offset
	/** @type {RHElement} */
	frame_center
	/** @type {RHElement} */
	frame_offset

	settings = {
		/** @description Text that will appear orbiting the left  */
		text_left: undefined,
		/** @description ETC */
		text_right: undefined,
	}

	_config_default()
	{
		return {
			text_left: "",
			text_right: "",
		}
	}

	_on_link_post()
	{
		// Throw one render in, so there's not just a blank screen.
		this._on_render()
		// This bit might take a little time.
		this.network = this.generate_constellation(5, 5)
		this.network_offset = this.generate_constellation(6, 4)
		this.network.solve()
		this.network_offset.solve()
		// The below is a primitive way to cause redraw to occur. It will not work with rotation as re-render
		// literally reforms the entire dom. A dom-caching scheme will need to be put into play for this to work.
		//let steps = 0
		//let redraw = ()=>
		//{
		//	steps += 1
		//	if(!this.network._solve_step() && steps < 5000)
		//	{
		//		this._on_render()
		//		window.setTimeout(redraw, 20)
		//		//redraw()
		//		//console.log("Bip")
		//	}
		//	else
		//	{
		//		console.log("Finished!")
		//		this._on_render()
		//	}
		//}
		//redraw()

		// Pretty critical; this ensures that the grids are rendered with the correct dimensions.
		this.render_checksum_add_tracked('cont_dims', ()=>
		{
			return JSON.stringify(this.cont_outer.getBoundingClientRect())
		})
	}

	_on_render()
	{
		// NOTE:
		// For now, this is really not intended to be called at all after the first time. checksum's should
		// handle that automatically.

		let bb = this.cont_outer.getBoundingClientRect()
		
		let polar_dotted = this._draw_polar_frame(
			72, 100, 'frame-border-dashed', bb
		)
		let polar_red = this._draw_polar_frame(
			72, 100, 'frame-border-red', {width: bb.width*2, height: bb.height}
		)
		this.frame_center.empty()
		this.frame_offset.empty()
		this.frame_center.append(polar_dotted)
		this.frame_offset.append(polar_red)

		this.const_center.empty()
		this.const_offset.empty()

		if(this.network)
		{
			this._draw_network(this.network, this.const_center, 15)
			this._draw_network(this.network_offset, this.const_offset, 30)
		}

		// Add text
		let text1 = this._draw_radial_text(
			new Vector2D(0, 0), 210, this.config.text_left, "text-title", "#6e726e", 90
		)
		// There's a bug with having two text things in the same element right now...
		//let text2 = this._draw_radial_text(
		//	new Vector2D(0, 0), 150, "NAVIGATOR", "text-title", "#6e726e", 90
		//)
		let text3 = this._draw_radial_text(
			new Vector2D(0, 0), 210, this.config.text_right, "text-title", "#984B43", 90
		)
		this.const_center.append(text1)
		//this.const_center.append(text2)
		this.const_offset.append(text3)
	}

	/**
	 * Generate a 'constellation', that is, a random network with N nodes.
	 * 
	 * The general plan here is to generate the 'origin' node, and then work outwards with decreasing numbers
	 * of orbiting nodes for each 'order' away from the center.
	 * 
	 * This decrease should proceed by approximately halving each time until 1 is reached, and then propagating
	 * until there are exactly as many nodes as called for. Some randomness will be thrown in.
	 * 
	 * @param {Number} n_nodes number of nodes to have in the constellation
	 * 
	 * @returns {Network}
	 */
	generate_constellation(n_orders, density)
	{
		let max_node_wt = 2
		let n_first = density // Compute later as a function of n_nodes
		let origin_node = {id: 1, wt: max_node_wt}
		let last_order_of_nodes = [origin_node],
			last_order = 0,
			last_node_id = 1,
			last_edge_id = 1
		let nodes = {1: origin_node}, edges = {}

		for(let order = 0; order < n_orders; order++)
		{
			order = last_order + 1

			// This will halve as many times as we are orders (past 1) away from center
			let n_children = Math.floor(n_first / (2**(order - 1)))
			// Can not be below 1
			n_children = Math.max(n_children, 1)

			// For each node in our last order set, add n_children new nodes.
			let current_order_nodes = []
			last_order_of_nodes.forEach((node)=>
			{
				// Randomly add or remove bonus
				let n_children_actual = n_children
				let rand = Math.random()
				if(rand > 0.66) n_children_actual++
				else if(rand < 0.44) n_children_actual--

				for(let i = 0; i < n_children_actual; i++)
				{
					last_node_id++
					last_edge_id++
					let wt = linterp(0, n_orders, 0.5, max_node_wt, order) + (Math.random()*0.5 - 0.25)
					let child_node = {id: last_node_id, wt: wt}
					let child_edge = {id: last_edge_id, wt: 1, nid_orig: node.id, nid_term: child_node.id}

					nodes[child_node.id] = child_node
					edges[child_edge.id] = child_edge

					current_order_nodes.push(child_node)
				}
			})

			last_order_of_nodes = current_order_nodes
			last_order = order
		}

		return new Network(nodes, edges, origin_node.id)
	}

	/**
	 * Draw the provided network onto the provided element. Element will NOT be cleared.
	 * 
	 * @param {Network} network A filled-out network at any state
	 * @param {RHElement} el An element into which all network nodes and edges will be absolutely positioned
	 * @param {Number} upscale Amount to upscale native network coordsys by for viewing
	 */
	_draw_network(network, el, upscale)
	{
		let scaler = (vec)=>
		{
			return vec.mult_scalar(upscale)
		}
		Object.values(network.edges).forEach((edge)=>
		{
			el.append(this._draw_edge(
				scaler(edge.node_orig.pos),
				scaler(edge.node_term.pos)
			))
		})
		Object.values(network.nodes).forEach((node)=>
		{
			el.append(this._draw_star_major(
				scaler(node.pos)
				, node.wt))
		})
	}

	/**
	 * Draw an 'edge' for the map in terms of absolute coords from A to B.
	 * 
	 * @param {Vector2D} A
	 * @param {Vector2D} B
	 * 
	 * @returns {RHElement} An element which, if added to the map, will show in the correct spot.
	 */
	_draw_edge(A, B)
	{
		let html = /* html */`
		<div rfm_member='point' class='point'>
			<div rfm_member='edge' class='edge'></div>
		</div>
		`
		let fab = new Fabricator(html)
		fab.fabricate()

		let point = fab.get_member('point')
		let edge = fab.get_member('edge')
		let vc = A.add(B).mult_scalar(0.5)
		let dir = B.add(A.mult_scalar(-1))

		point.style.transform = `translate(${vc.x}px, ${vc.y}px) rotate(${dir.theta}rad)`
		edge.style.width = `${dir.magnitude}px`
		edge.style.left = `-${dir.magnitude/2}px`
		edge.style.top = `-${1/2}px`
		
		return point
	}

	/**
	 * Draw a 'major' star at the specified coordinates and return an element that can be placed in a 'frame'
	 * element that will show correctly.
	 * 
	 * @param {Object} location {x:px, y:px} of the centerpoint of the star
	 * @param {Number} size As a multiple of standard, e.g. 1.0 will return the 'default' size and 2.0 will double
	 * 
	 * @returns {RHElement}
	 */
	_draw_star_major(location, size)
	{
		let html = /* html */`
			<div rfm_member='point' class='point'>
				<div rfm_member='star' class='star-major'>

					<svg width="100%" height="100%" version="1.1" viewBox="0 0 37.042 37.042" 
						xmlns="http://www.w3.org/2000/svg">
						<path d="m18.521-2.3734e-7s-1e-6 13.229-2.6458 15.875-15.875 2.6458-15.875 2.6458 
						13.229-1e-6 15.875 2.6458 2.6458 15.875 2.6458 15.875-1e-6 -13.229 2.6458-15.875 
						15.875-2.6458 15.875-2.6458-13.229-1e-6 
						-15.875-2.6458c-2.6458-2.6458-2.6458-15.875-2.6458-15.875z" 
						fill="none" stroke="#888888" stroke-width="2"/>
					</svg>
				</div>
			</div>
		`
		let fab = new Fabricator(html)
		fab.fabricate()

		let star = fab.get_member('star')
		let point = fab.get_member('point')
		let size_base = 15, sz = size*size_base
		let angle = (new Vector2D(location.x, location.y)).theta

		star.style.width = `${sz}px`
		star.style.height = `${sz}px`
		star.style.left = `-${sz/2}px`
		star.style.top = `-${sz/2}px`
		star.style.borderRadius = `${sz/2}px`
		point.style.left = `${location.x}px`
		point.style.top = `${location.y}px`
		point.style.transform = `rotate(${angle}rad)`

		if(size < 1.5)
		{
			star.style.backgroundColor = 'transparent'
		}
		
		return point
	}

	/**
	 * Draw a frame of borders to represent a polar coordinate.
	 * 
	 * @param {Number} n_radial How many radial lines to spread from the center. It's best if this is a multiple
	 * 							of six.
	 * @param {Number} ring_period Difference in radius between one ring and the next.
	 * @param {String} border_class Class name to set border color and style.
	 * @param {Object} bounding_box {width: px, height: px} size of a box to be completely filled by frame.
	 * 
	 * @returns {RHElement} An element containing all created elements that form the wireframe.
	 */
	_draw_polar_frame(n_radial, ring_period, border_class, bounding_box)
	{
		// Create output element.
		let frame = RHElement.wrap(document.createElement("div"))
		frame.classList.add("polar-frame")

		// First draw all rings.
		let r_min = Math.sqrt((bounding_box.width/2)**2 + (bounding_box.height/2)**2),
			r = ring_period,
			n_rings = Math.ceil(r_min / r)

		for(let i = 0; i < n_rings; i++)
		{
			let ring = document.createElement("div")
			let ring_r = r * (i + 1)
			ring.style.width = `${ring_r*2}px`
			ring.style.height = `${ring_r*2}px`
			ring.style.top = `-${ring_r}px`
			ring.style.left = `-${ring_r}px`
			ring.style.borderRadius = `${ring_r}px`
			ring.classList.add(border_class)
			ring.classList.add("ring")
			frame.append(ring)
		}

		// Then draw all radial lines.
		for(let i = 0; i < n_radial; i++)
		{
			// Construct HTML
			let html = /* html */`
				<div rfm_member='point' class='point'>
					<div rfm_member='line' class='radial-line ${border_class}'></div>
				</div>
			`
			let fab = new Fabricator(html)
			fab.fabricate()

			// Construct vars
			let radial = fab.get_member('point')
			let line = fab.get_member('line')
			let radial_w = r_min
			let radial_angle = (360/n_radial) * i
			let r_offset = 3*r

			// Choose offset on the basis of interior symmetry. First ring has none, second has 1/4 of radials,
			// third has half, rest have all.
			if(i % (n_radial / 12) == 0) r_offset = r
			else if(i % (n_radial / 24) == 0) r_offset = 2*r

			// Modify individual elements
			radial.style.transform = `rotate(${radial_angle}deg)`
			line.style.width = `${radial_w}px`
			line.style.transform = `translate(${r_offset}px, 0px)`

			frame.append(radial)
		}

		return frame
	}

	/**
	 * Create text on an arc tracing 'radius' about a point defined by location. This is done using the
	 * SVG method. It's a little clunky. Color, for example, must be manually provided
	 * 
	 * @param {Vector2D} location 
	 * @param {Number} radius 
	 * @param {String} text 
	 * @param {String} text_class
	 * @param {String} color Hex color code for text.
	 * @param {Number} angle The angle at which the center of text will be aligned.
	 * 
	 * @returns {RHElement}
	 */
	_draw_radial_text(location, radius, text, text_class, color, angle)
	{
		let html = /* html */`
		<div rfm_member='point' class='point'>
			<div rfm_member='inner' class='radial-text'>
				<svg class='radial-text' width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
					<path
					id="circlePath"
					d="
					M 0, ${radius}
					a ${radius},${radius} 0 1,1 ${2*radius},0
					${radius},${radius} 0 1,1 ${-2*radius},0
					"
					fill="none"
					stroke="none"
					/>
					<text style="text-anchor: middle;" class='${text_class}' fill=${color}>
						<textPath href="#circlePath" startOffset="50%">
							${text}
						</textPath>
					</text>
				</svg>
			</div>
		</div>
		`

		let fab = new Fabricator(html)
		fab.fabricate()

		let point = fab.get_member('point')
		let inner = fab.get_member('inner')

		point.style.top = `${location.x}px`
		point.style.left = `${location.y}px`
		inner.style.top = `${-radius}px`
		inner.style.left = `${-radius}px`
		inner.style.width = `${radius*2}px`
		inner.style.height = `${radius*2}px`
		inner.style.rotate = `${angle-180}deg`

		return point
	}
}

export { RegConstellation }