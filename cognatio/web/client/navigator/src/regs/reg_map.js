/**
 * @file A region for the map region, which contains the viewport.
 * @author Josh Reed
 */

import { Region, Fabricator, RHElement, throttle_leading } from "../lib/regional.js"
import { RegSWNav, RegViewport, Network, Vector2D } from "../nav.js"

/**
 * The map shows the location of some or all of the nodes in the network. This is a way to render the
 * visualized graphs produced by the Network machinery.
 */
class RegMap extends Region
{
	fab_get()
	{
		let css = /* css */`
			[rfm_reg="RegMap"] {
				/* The backdrop is the 'black void' of the background. It does not move. */
				& .cont-backdrop {
					position: relative;
					width: 100%; height: 100%;
					display: flex;
					flex-direction: column;
					align-items: flex-start;
					justify-content: center;

					background-color: var(--metal-dark);
				}
				/* Things are positioned in the map. It preserves parent location and size so that viewport
				can inherit, but overflow is visible so things positioned way far away can still render.
				
				Transitions are applied against this to pan and zoom about.
				*/
				& .cont-map {
					position: absolute;
					width: 100%; height: 100%;
					overflow: visible;
					
					transform: scale(1, 1) translate(0px, 0px);
					transition: 0.5s;
				}
				& .cont-viewport {
					position: absolute;
					width: 100%; height: 100%;
					top: 0; left: 0;
					overflow: visible;
					box-sizing: border-box;

					background-color: white;
				}
				& .cont-viewport.map-enabled {
					box-shadow: 0px 0px 25px 25px var(--ethblue-lightest);
					border: 4px solid var(--ethblue-dark);
				}
				/* A sub-div of the map that exists purely as an administrative division so that map bodies
				can be cleared with empty() */
				& .cont-network {
					position: absolute;
					width: 100%; height: 100%;
					top: 50%; left: 50%;
					overflow: visible;

					background-color: transparent;
				}
			}
		`
		let html = /* html */`
		<div class='cont-backdrop'>
			<div rfm_member='map' class='cont-map'>
				<div rfm_member='cont_network' class='cont-network'></div>
				<div rfm_member='cont_viewport' class='cont-viewport'></div>
			</div>
		</div>
		`
		return new Fabricator(html).add_css_rule(css)
	}

	settings = {
		/** @description Zoom level. 0.5 is zoomed out such that objects are 50% of size, etc. */
		zoom: undefined,
		/** @description X-coordinate (px) of the map that the center of reg container will be over. */
		x: undefined,
		/** @description Y-coordinate (px) of the map that the center of reg container will be over. */
		y: undefined,
		/** @description The network instance, which stores map location info for nodes. */
		network: undefined,
	}

	/** @type {RegSWNav} Reference to the switchyard region. */
	swyd
	/** @type {RegViewport} */
	reg_viewport
	/** @type {RHElement} */
	cont_viewport
	/** @type {RHElement} */
	cont_network
	/** @type {RHElement} */
	map

	_create_subregions()
	{
		this.reg_viewport = new RegViewport().fab().link(this, this.cont_viewport)
	}

	_on_link_post()
	{
		this.datahandler_subscribe(this.swyd.dh_edge)
		this.datahandler_subscribe(this.swyd.dh_page)
		this.render_checksum_add_tracked('map_enabled', ()=>{return this.swyd.settings.map_enabled})
		this.render_checksum_add_tracked('active_page_id', ()=>{return this.swyd.settings.page_id})

		this._setup_pan_and_zoom_handlers()
	}

	/**
	 * Bind handlers that allow pan and zoom in the map for both click and touch events.
	 */
	_setup_pan_and_zoom_handlers()
	{
		this._setup_pan_and_zoom_handlers_click()
		this._setup_pan_and_zoom_handlers_touch()
	}

	/**
	 * Bind the event handlers that allow a 'pan' operation to occur via click-and-drag.
	 */
	_setup_pan_and_zoom_handlers_click()
	{
		this._clickdrag = {
			lmb_held: false,
			rmb_held: false,
			lmb_last: {x: 0, y: 0}
		}

		this.reg.addEventListener('mousedown', (e)=>
		{
			if(e.button == 0)
			{
				this._clickdrag.lmb_held = true
				this._clickdrag.lmb_last.x = e.clientX
				this._clickdrag.lmb_last.y = e.clientY
			}
			if(e.button == 2) this._clickdrag.rmb_held = true
		})
		this.reg.addEventListener('mouseup', (e)=>
		{
			this._clickdrag.lmb_held = false
			this._clickdrag.rmb_held = false
		})
		this.reg.addEventListener('mousemove', throttle_leading(1000/120, (e)=>
		{
			if(this._clickdrag.lmb_held)
			{
				this._pan_by(
					new Vector2D(
						e.clientX - this._clickdrag.lmb_last.x,
						e.clientY - this._clickdrag.lmb_last.y,
					)
				)
				this._clickdrag.lmb_last.x = e.clientX
				this._clickdrag.lmb_last.y = e.clientY
			}
		}))

		this._wheel = {
			accrued_delta: 0
		}
		this.reg.addEventListener('wheel', (e)=>
		{
			this._wheel.accrued_delta += e.wheelDelta
		})
		this.reg.addEventListener('wheel', throttle_leading(1000/120, (e)=>
		{
			// Compute mouse position in viewport coords.
			let bb = this.reg.getBoundingClientRect()
			let p_vp_cursor = new Vector2D(
				(e.clientX - bb.x) - (bb.width / 2),
				(e.clientY - bb.y) - (bb.height / 2),
			)
			this._zoom_at(this._wheel.accrued_delta, p_vp_cursor)
			this._wheel.accrued_delta = 0
		}))
	}

	/**
	 * Bind the event handlers that allow a 'pan' operation to occur via touch-and-drag.
	 */
	_setup_pan_and_zoom_handlers_touch()
	{
		this._touchdrag = {
			A: {x: 0, y: 0},
			B: {x: 0, y: 0},
			center_last: {x: 0, y: 0},
			n: 0,
			dist_last: 0
		}
		// Doctrine here is to distinguish between one- and two-touch events. One-touch is a pan operation
		// and two-touch is a zoom.

		/**
		 * Helper function to update touchdrag points from event. Will correctly store one or two touch data.
		 */
		let touch_update = (e)=>
		{
			if(e.touches.length > 1)
			{
				this._touchdrag.B.x = e.touches[1].clientX
				this._touchdrag.B.y = e.touches[1].clientY
			}
			if(e.touches.length > 0)
			{
				this._touchdrag.A.x = e.touches[0].clientX
				this._touchdrag.A.y = e.touches[0].clientY
			}
			this._touchdrag.n = e.touches.length
			this._touchdrag.center_last = get_touch_center(e)
			this._touchdrag.dist_last = get_touch_dist(e)
		}
		/**
		 * @returns Correct 'center' of the touch event, just the touch or average of two if two-touch.
		 */
		let get_touch_center = (e)=>
		{
			if(this._touchdrag.n == 1)
			{
				return {x: e.touches[0].clientX, y: e.touches[0].clientY}
			}
			if(this._touchdrag.n == 2)
			{
				return {
					x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
					y: (e.touches[0].clientY + e.touches[1].clientY) / 2
				}
			}
		}
		/**
		 * @returns Distance between touches for n=2 touch.
		 */
		let get_touch_dist = (e)=>
		{
			if(e.touches.length != 2) return 0

			return new Vector2D(
				e.touches[0].clientX - e.touches[1].clientX,
				e.touches[0].clientY - e.touches[1].clientY
			).magnitude
		}

		this.reg.addEventListener('touchstart', (e)=>
		{
			e.preventDefault()
			e.stopPropagation()
			if(e.touches.length > 2) return
			touch_update(e)
		})
		this.reg.addEventListener('touchend', (e)=>
		{
			e.preventDefault()
			e.stopPropagation()
			this._touchdrag.n = 0
		})
		this.reg.addEventListener('touchmove', throttle_leading(1000/120, (e)=>
		{
			e.preventDefault()
			e.stopPropagation()
			if(this._touchdrag.n == 0 || this._touchdrag.n > 2) return

			let center = get_touch_center(e)

			// One finger is enough for a pan operation.
			if(this._touchdrag.n > 0)
			{
				this._pan_by(
					new Vector2D(
						center.x - this._touchdrag.center_last.x,
						center.y - this._touchdrag.center_last.y,
					)
				)
			}
			// But if there are two fingers, we should zoom too.
			if(this._touchdrag.n > 1)
			{
				// Compute mouse position in viewport coords.
				let bb = this.reg.getBoundingClientRect()
				let p_vp_cursor = new Vector2D(
					(center.x - bb.x) - (bb.width / 2),
					(center.y - bb.y) - (bb.height / 2),
				)
				this._zoom_at(3*(get_touch_dist(e) - this._touchdrag.dist_last), p_vp_cursor)
			}

			// Update after all can use relative positioning.
			touch_update(e)
		}))
	}

	/**
	 * 
	 * @param {Number} page_id The ID of the node that was clicked.
	 */
	_node_click(page_id)
	{
		this.swyd.page_nav(page_id)
	}

	/**
	 * Transform vector points from origin of viewport to origin of map coord systems and is in viewport space.
	 * 
	 * @returns {Vector2D} The map's transform coords as a vector.
	 */
	get T()
	{
		return new Vector2D(this.settings.x, this.settings.y)
	}

	set T(vec)
	{
		this.settings.x = vec.x;
		this.settings.y = vec.y
	}

	/**
	 * Coordinate transform a vector.
	 * 
	 * @param {Vector2D} vec Input vector in map coordinates
	 * 
	 * @returns {Vector2D} Output vector in viewport coordinates
	 */
	coord_m2vp(vec)
	{
		return vec.add(this.T.mult_scalar(-1)).mult_scalar(1 / this.settings.zoom)
	}

	/**
	 * Coordinate transform a vector.
	 * 
	 * @param {Vector2D} vec Input vector in viewport coordinates
	 * 
	 * @returns {Vector2D} Output vector in map coordinates
	 */
	coord_vp2m(vec)
	{
		return this.T.add(vec.mult_scalar(this.settings.zoom))
	}

	/**
	 * Zoom the map in our out by an amount.
	 * 
	 * @param {Number} amount The amount to zoom by. Intended to be a wheeldelta. Positive in, negative out.
	 */
	_zoom(amount)
	{
		let scale_diff = amount / 1000
		this.settings.zoom += (scale_diff * this.settings.zoom)
		this.render()
	}

	/**
	 * Zoom the map in our out by an amount 'centered' about the provided coordinate in viewport-space.
	 * 
	 * @param {Number} amount The amount to zoom by. Intended to be a wheeldelta. Positive in, negative out.
	 * @param {Vector2D} p_vp_center The position to center by, in viewport coords.
	 */
	_zoom_at(amount, p_vp_center)
	{
		// Remember, coordsys is down and to the right.
		// Get scalar zoom quantities.
		let scale_diff = amount / 1000
		let z0 = 1, z1 = this.settings.zoom, z2 = this.settings.zoom + (scale_diff * this.settings.zoom)

		// Ok, the idea here is that the cursor should remain pointing at the same spot both before and after
		// zooming. So, all that must be done is to compute the coordinates of the cursor in pre-zoom space
		// and move post-zoom space such that the coords to the cursor remain the same.
		//
		// The below can be algebraically simplified, but it's not that expensive and I like having
		// derivation results followable in code.

		// Translation vector from VP origin (0) to pre-zoom map origin ('/1)
		let t01 = this.T
		// Vector to cursor, in VP coords (0)
		let c0 = p_vp_center
		// Perform a coordinate transform to obtain vector to cursor in pre-zoom map coords ('/1)
		let c1 = c0.subtract(t01).mult_scalar(z0 / z1)
		// The vector to cursor in post-zoom map coords ("/2). It will not change, as everything in map space
		// should still be at the same positions.
		let c2 = c1
		// Now, using an algebraic manipulation of the coord transform formula, discover what the new translation
		// vector from VP (0) to post-zoom ("/2) should be.
		let t02 = c0.subtract(c2.mult_scalar(z2 / z0))
		
		// Apply conclusions
		this.settings.zoom = z2
		this.T = t02

		this.render()
	}

	/**
	 * Pan by a relative amount. This is not in map coords, but in viewport coords. It will need to be adjusted
	 * by the scale number.
	 * 
	 * @param {Vector2D} vec_vp
	 */
	_pan_by(vec_vp)
	{
		this.T = this.T.add(vec_vp)
		this.render()
	}

	/**
	 * Adjust the location that the center of the map viewport is aiming, in terms of map space. For example,
	 * -100, -100 would position the center of the current page iframe 100px down and to the right
	 * of the center of the map viewport.
	 * 
	 * @param {Number} x The x-coord of center of map viewport, in pixels.
	 * @param {Number} y The y-coord of center of map viewport, in pixels.
	 */
	_pan_abs(x, y)
	{
		this.settings.x = x
		this.settings.y = y
		this.render()
	}

	/**
	 * Construct a new Network instance from the page and edge datahandlers. The data contained in the network
	 * instance can be thought of as a cache of the datahandler info. It is stored in region settings and
	 * checksummed like any other driving local setting.
	 * 
	 * Mass is converted from it's usual N-words to a 'weight' value, which is more appropriate for mapping.
	 * Weight is 1 + (mass / 1000)
	 * 
	 * @returns {Network} Network instance, unsolved.
	 */
	network_construct()
	{
		let edges = {}, nodes = {}
		Object.entries(this.swyd.dh_edge._data).forEach(([id, data])=>
		{
			edges[id] = {
				id: id,
				nid_orig: data.page_id_orig,
				nid_term: data.page_id_term,
				wt: data.bond_strength_cached,
			}
		})
		Object.entries(this.swyd.dh_page._data).forEach(([id, data])=>
		{
			nodes[id] = {
				id: id,
				wt: 1 + (data.mass_cached / 1000),
			}
		})
		// Make a full network. This will, among other nonimportant things, classify nodes by order.
		let full_network = new Network(nodes, edges, this.swyd.settings.page_id)

		// Now make a sub-network that only goes so many steps out from center.
		return full_network.subnetwork_get(2)
	}

	/**
	 * This is intended to be called pretty frequently to solve the network. It will only do so if some feed
	 * data has changed. Right now, this is only the edge and node data from the datahandlers.
	 * 
	 * @returns {Promise} That resolves when the network is solved. If already solved, resolve immediately.
	 */
	async _network_solve()
	{
		return new Promise((res, rej)=>
		{
			let csums_old = this.settings.network_checksums,
				csums_new = {
					'csum_dh_edge': this.swyd.dh_edge.checksum,
					'csum_dh_page': this.swyd.dh_page.checksum,
					'literal_page_id': this.swyd.settings.page_id,
				},
				all_match = true
			Object.entries(csums_new).forEach(([key, csum])=>
			{
				if(csums_old[key] != csum) all_match = false
			})
			if(!all_match)
			{
				this.settings.network_checksums = csums_new
				this.settings.network = this.network_construct()
				this.settings.network.solve()
				console.log(`Solved network in ${this.settings.network._solution_time_ms}ms`)
			}
			res()
		})
		
	}

	_on_settings_refresh()
	{
		// X, Y, and Z here form a transform from viewport coordinates to map coordinates.
		// If P is a point in vp space and p the same point in map space, then
		// p = (1 / Z) (P - T) where T is a vector composed of (X and Y)
		this.settings.zoom = 0.5
		this.settings.x = 0
		this.settings.y = 0

		this.settings.network = undefined
		this.settings.network_checksums = {}
		// The 'base' numbers here are all relative to each other and will scale by an appropriate number.
		this.settings.base_node_dia = 0.025
		this.settings.base_node_dist = 1
		this.settings.base_edge_thick = 0.005
		this.settings.network_scale = 2000
	}

	_on_render()
	{
		if(this.swyd.settings.map_enabled)
		{
			// Nicely, since I translate and then scale, using the base T vector just works.
			let z = this.settings.zoom,
				x = this.settings.x,
				y = this.settings.y
			//console.log(`T01_x: ${x}, T01_y: ${y}, Z1: ${z}`)
			this.map.style.transform = `translate(${x}px, ${y}px) scale(${z}, ${z})`
			this.cont_viewport.classList.add('map-enabled')
			// This setTimeout tomfoolery enables smooth transitions for the initial lever-pull but immediately
			// responsive adjustments afterwards.
			window.setTimeout(()=>{this.map.style.transition = '0s'}, 500)

			// Re-render all network nodes and edges.
			this._network_solve().then(()=>
			{
				this._render_network(this.settings.network)
			})
		}
		else
		{
			this.cont_viewport.classList.remove('map-enabled')
			this.map.style.transform = ""
			this.map.style.transition = ""
		}
	}

	/**
	 * Re-render the entire map's network-dependent graphics. This will be many nodes and edges.
	 * 
	 * @param {Network} network A network instance that is configured. Does not have to be solved.
	 */
	_render_network(network)
	{
		this.cont_network.empty()
		network.edges_get_flat().forEach((edgeref)=>
		{
			this.cont_network.append(
				this._draw_edge(
					this._map_network_coord_transform(network.nodes[edgeref.node_id_1].pos),
					this._map_network_coord_transform(network.nodes[edgeref.node_id_2].pos),
					// Scale from 1 to 2 on strength.
					(1 + (edgeref.wt / 5)) * this.settings.base_edge_thick * this.settings.network_scale,
					edgeref.double
				)
			)
		})
		Object.values(network.nodes).forEach((node)=>
		{
			this.cont_network.append(
				this._draw_node(
					node.id,
					this.swyd.dh_page.comp_get(node.id).name,
					this._map_network_coord_transform(node.pos),
					node.wt * this.settings.base_node_dia * this.settings.network_scale / 2
				)
			)
		})
	}

	/**
	 * This translates a vector from network space to map space.
	 * 
	 * @param {Vector2D} vec 
	 */
	_map_network_coord_transform(vec)
	{
		return vec.mult_scalar(this.settings.network_scale)
	}

	/**
	 * Draw an 'edge' for the map in terms of absolute coords from A to B.
	 * 
	 * @param {Vector2D} A
	 * @param {Vector2D} B
	 * @param {Number} weight Weight of line, px
	 * @param {Boolean} double If true, draw double lines at half weight each
	 * 
	 * @returns {RHElement} An element which, if added to the map, will show in the correct spot.
	 */
	_draw_edge(A, B, weight, double)
	{
		let css = /* css */`
			edge {
			
				position: absolute;
				width: 0; height: 0;
				
				& .edge {
					position: absolute;
					height: 0px;

					box-shadow: 0px 0px ${weight*4}px ${weight}px var(--ethblue-lightest);
					background-color: var(--ethblue-light);

					border-top-style: solid;
					border-bottom-style: solid;
					border-top-color: var(--ethblue-light);
					border-bottom-color: var(--ethblue-light);
				}
			}
		`
		let html = /* html */`
		<edge rfm_member='point'>
			<div rfm_member='edge' class='edge'></div>
		</edge>
		`
		let vc = A.add(B).mult_scalar(0.5)
		let dir = B.add(A.mult_scalar(-1))
		let fab = new Fabricator(html).add_css_rule(css)
		fab.fabricate()
		let point = fab.get_member('point'), edge =fab.get_member('edge')
		point.style.transform = `translate(${vc.x}px, ${vc.y}px) rotate(${dir.theta}rad)`
		edge.style.width = `${dir.magnitude}px`
		edge.style.left = `-${dir.magnitude/2}px`
		edge.style.borderWidth = `${weight/2}px`
		edge.style.top = `-${weight/2}px`
		if(double)
		{
			edge.style.height = `${weight}px`
			edge.style.backgroundColor = 'transparent'
			edge.style.top = `-${weight}px`
		}
		return point
	}
	
	/**
	 * Draw a 'node' for the map in terms of absolute coords at P
	 * 
	 * @param {Number} node_id The node / page ID that this node represents.
	 * @param {String} node_name The name, or title, of the node as it will appear on the map.
	 * @param {Vector2D} P {x:x, y:y} px
	 * @param {Number} radius The radius of the circle that forms the node.
	 * 
	 * @returns {RHElement} An element which, if added to the map, will show in the correct spot.
	 */
	_draw_node(node_id, node_name, P, radius)
	{
		let halo_mult = 3,
			magfield_dia = radius*halo_mult*4,
			line_height = radius*2

		let css = /* css */`
			node {
				position: absolute;
				width: 0; height: 0;

				& .node {
					position: absolute;
					width: ${radius*2}px; height: ${radius*2}px;
					left: -${radius}px; top: -${radius}px;
					box-sizing: border-box;

					box-shadow: 0px 0px ${radius*halo_mult*2}px ${radius*halo_mult}px var(--ethblue-lightest);

					border-radius: ${radius*2}px;
					background-color: white;
					/*border: ${radius/4}px solid var(--ethblue-lightest);*/
				}
				& .magfield {
					position: absolute;
					width: ${magfield_dia}px; height: ${magfield_dia}px;
					left: -${magfield_dia/2}px; top: -${magfield_dia/2}px;
					border-radius: ${magfield_dia/2}px;
					box-sizing: border-box;

					cursor: pointer;

					border: ${radius/5}px solid transparent;
				}
				& .magfield:hover {
					border: ${radius/5}px solid white;
				}
				& .title {
					position: absolute;
					height: ${line_height}px;
					top: -${line_height/2}px;
					left: ${magfield_dia/2}px;
					display: flex; align-items: center;

					color: var(--ethblue-lightest);
					font-family: "IBMPlexMono";
					background-color: transparent;
					user-select: none;
					font-size: ${line_height}px;
				}
				& .title::selection {
					background-color: none;
				}
			}
		`
		let html = /* html */`
		<node rfm_member='point'>
			<div rfm_member='title' class='title'>${node_name}</div>
			<div rfm_member='node' class='node'></div>
			<div rfm_member='magfield' class='magfield'></div>
		</node>
		`
		let fab = new Fabricator(html).add_css_rule(css)
		fab.fabricate()
		let point = fab.get_member('point')
		let magfield = fab.get_member('magfield')
		let title = fab.get_member('title')
		point.style.transform = `translate(${P.x}px, ${P.y}px)`
		magfield.addEventListener('click', ()=>
		{
			this._node_click(node_id)
		})
		return point
	}
}

export {RegMap}