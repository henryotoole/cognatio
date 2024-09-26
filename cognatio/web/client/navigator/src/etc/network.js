/**
 * @file Contains a class which is used to generate a planar graph of a network. As above, so below.
 * @author Josh Reed
 */

import { Vector2D } from "../nav.js"

/**
 * The network is a sort of visualizer-engine. It takes a complex graph of edges and nodes and positions them
 * on a field in accordance with weights both of edges and of nodes. It is deterministic - the same input
 * will invariably produce the same output even if the orders of nodes or edges are altered.
 * 
 * The network does not actually do any rendering. Its product is a set of 2D coordinates for each node.
 * 
 * Will the graph need to be truncated such that it is planar? we will see.
 * 
 * The lifecycle / usage of a network is as follows:
 * 1. Construct a new Network.
 * 2. OPTIONAL: Configure it.
 * 3. Call solve().
 * 4. Use results.
 */
class Network
{
	/**
	 * Instantiate a new Network instance. All provided data will be safely de-referenced and truly copied to
	 * prevent accidental back-modification in, for example, a datahandler.
	 * 
	 * The iterative solver will need to be run with `solve()` before the results of this network can be used.
	 * 
	 * ```
	 * // Nodes are expected to take the form:
	 * {
	 *     id: X // ID back reference
	 *     wt: X // Weight of the node, as an integer
	 * }
	 * // Edges are expected to take the form:
	 * {
	 *     id: X // ID back reference
	 *     wt: X // Weight of the edge, as an integer
	 *     nid_orig: X // ID of originating end of edge
	 *     nid_term: X // ID of terminating end of edge
	 * }
	 * ```
	 * 
	 * Nodes with no edges are removed.
	 * 
	 * @param {Object} nodes ID-datadict map of node data.
	 * @param {Object} edges ID-datadict map of edge data.
	 * @param {Number} focal_point_id The ID of the 'focal point' node.
	 * @param {Number} mean_dist The mean distance between centers of average nodes.
	 */
	constructor(nodes, edges, focal_point_id, mean_dist=1)
	{
		this.nodes = {}
		this.edges = {}
		// This dereferences the input data and, unlike JSON.stringify, doesn't care if other references exist
		// and won't pull anything extra.
		Object.values(nodes).forEach((data)=>
		{
			this.nodes[data.id] = {id: data.id, wt: data.wt}
		})
		Object.values(edges).forEach((data)=>
		{
			this.edges[data.id] = {id: data.id, wt: data.wt, nid_orig: data.nid_orig, nid_term: data.nid_term}
		})
		this.focal_point_id = focal_point_id
		this.focal_node = this.nodes[this.focal_point_id]

		this.K_bond = 1
		this.K_mass = 1
		this.step_max_movement = 0.1
		/** @description If delta-position, delta-velocity, and absolute acc are below this value, break solver */
		this.step_break_thresh = 0.01

		this.configure_mean_dist(mean_dist)
		this._setup_crosslink_edges()
		this._setup_order_nodes()

		// Any node which, at this point, has no order is isolated from the focal point and should be removed.
		Object.keys(this.nodes).forEach((node_id)=>
		{
			if(this.nodes[node_id].order == undefined)
			{
				delete this.nodes[node_id]
			}
		})

		this._setup_node_kinematics()
	}

	/**
	 * Configure the constants such that the distance between two wt=1 nodes connected with one wt=1 edge
	 * will balance to the provided distance.
	 * 
	 * @param {Number} dist The average distance between centers.
	 */
	configure_mean_dist(dist)
	{
		this.K_bond = 1
		this.K_mass = (dist**2) / 2
	}

	/**
	 * @returns {Number} The mean distance that two standard nodes with one edge will position between centers.
	 */
	get mean_dist()
	{
		return Math.sqrt(2*(this.K_mass / this.K_bond))
	}

	/**
	 * Cross-link provided edges into provided nodes. This will give each node three `edges` properties, where
	 * 
	 * ```
	 * node.edges_orig = [edge_ref_1, edge_ref_2, ...] // Edges that originate with this node
	 * node.edges_term = [edge_ref_8, edge_ref_9, ...] // Edges that terminate on this node
	 * ```
	 * 
	 * Also link nodes by reference to edges.
	 * 
	 * ```
	 * edge.node_orig = NODE_REF
	 * edge.node_term = NODE_REF
	 * ```
	 */
	_setup_crosslink_edges()
	{
		// Create default lists.
		Object.values(this.nodes).forEach((node)=>
		{
			node.edges_orig = []
			node.edges_term = []
		})

		Object.entries(this.edges).forEach(([id, edge_data])=>
		{
			// Validate reference
			if(this.nodes[edge_data.nid_orig] == undefined) throw new Error("Edge node ref not in node list.")
			if(this.nodes[edge_data.nid_term] == undefined) throw new Error("Edge node ref not in node list.")

			// Append reference
			this.nodes[edge_data.nid_orig].edges_orig.push(this.edges[id])
			this.nodes[edge_data.nid_term].edges_term.push(this.edges[id])
			// And add edge references
			this.edges[id].node_orig = this.nodes[edge_data.nid_orig]
			this.edges[id].node_term = this.nodes[edge_data.nid_term]
		})
	}

	/**
	 * Quantify and organize nodes on the basis of 'order', where order is the minimum number of steps required to
	 * reach a node starting at the focal point.
	 * 
	 * This function will give each node the `order` property, which is simply how many steps are required to
	 * get back to the focal node.
	 */
	_setup_order_nodes()
	{
		if(Object.keys(this.nodes).length == 0) return

		// Ensure no orders exist.
		Object.values(this.nodes).forEach((node)=>
		{
			delete node.order
		})

		// Simple algo - start with focal node and work outwards ONE RING AT A TIME. Must not follow all the
		// way to end of branch at first!
		let current_order = 0,
			next_order_node_list = {}, // ID-map so we don't get duplicates.
			current_node_list = [this.focal_node]

		// As long as the current node hopper has something in it, proceed.
		while(current_node_list.length > 0)
		{
			// Loop through 'current list', applying the current order number and collecting the next order's
			// list of nodes.
			current_node_list.forEach((node)=>
			{
				// This exists in case a node is found downstream of another node, in a loop before reaching
				// that 'found-to-be-downstream' node.
				if(node.order != undefined) return
				node.order = current_order
				// Bidirectional duplicates are removed by ID-map
				node.edges_orig.forEach((edge)=>
				{
					// Check for undefined as some references will already have been processed.
					if(edge.node_term.order == undefined)
					{
						next_order_node_list[edge.node_term.id] = edge.node_term
					}
				})
				node.edges_term.forEach((edge)=>
				{
					// Check for undefined as some references will already have been processed.
					if(edge.node_orig.order == undefined)
					{
						next_order_node_list[edge.node_orig.id] = edge.node_orig
					}
				})
			})
			current_order += 1
			current_node_list = Object.values(next_order_node_list)
			next_order_node_list = {}
		}
	}

	/**
	 * Setup the kinematics for each node. At the start, velocity and acceleration will simply be zero. However,
	 * position is trickier. To create networks that will solve in reasonable amounts of time to deterministic
	 * arrangements, deliberate seeding of position is required. To choose a seeding algorithm is to choose how
	 * the graph will appear, so this function is highly important and will likely need variants that deal
	 * with different levels of network complexity.
	 * 
	 * FOR NOW the network is only intended to have one or two 'steps' outward from the focal point. The seeding
	 * algo for this is as follows:
	 * 1. Position focal point at origin
	 * 2. Add first-order nodes at equal-radial spacing about the focal point, starting at 0 degrees and
	 *    increasing in order of node ID (purely arbitrary but consistent)
	 * 3. For each first-order node, position all of its second-order nodes at equal-radius spacing on a
	 *    range of degrees centered on a line the same direction away from the origin as the parent. The width
	 *    of this range will be equal to 2x the angular distance between two nodes in the last-order's span.
	 * 
	 * The behavior of such a placement will be stranger the more interconnected the 1st, 2nd, etc. order nodes
	 * are with each other.
	 */
	_setup_node_kinematics()
	{
		if(Object.keys(this.nodes).length == 0) return
		// This can be somewhat recursive.

		// Set vel and acc
		Object.values(this.nodes).forEach((node)=>
		{
			node.vel = new Vector2D(0, 0)
			node.acc = new Vector2D(0, 0)
		})

		// Position first node and then recursively position downstream
		this.focal_node.pos = new Vector2D(0, 0)
		this._setup_kinematics_position(this.focal_node, (Math.PI / 2), Math.PI)
	}

	/**
	 * A recursive helper function that positions all downstream nodes of the provided node.
	 * 
	 * @param {Object} node Reference to the node that we are positioning the children of. Must itself
	 * 						be positioned already.
	 * @param {Number} center_angle The 'center angle' for the range of downstream children
	 * @param {Number} range The angular range that downstream children will occupy. 
	 */
	_setup_kinematics_position(node, center_angle, range)
	{
		// Collect downstream nodes
		let downstream = {}
		node.edges_orig.forEach((edge)=>
		{
			// Only collect those with higher order
			if(edge.node_term.order > node.order)
			{
				downstream[edge.node_term.id] = edge.node_term
			}
		})
		node.edges_term.forEach((edge)=>
		{
			// Only collect those with higher order
			if(edge.node_orig.order > node.order)
			{
				downstream[edge.node_orig.id] = edge.node_orig
			}
		})
		downstream = Object.values(downstream)

		if(downstream.length == 0) return

		// Get a list of angles to place downstream at.
		let angle_start = center_angle - (range / 2),
			angle_end = center_angle + (range / 2),
			angles = Network.space_between(angle_start, angle_end, downstream.length)
		
		// Sort downstream by ID.
		downstream.sort((a, b)=> {return a.id - b.id})

		// Position each and their sub-nodes
		let furtherdown_range = (range / downstream.length)
		downstream.forEach((downstream_node, downstream_i)=>
		{
			// Position child.
			downstream_node.pos = node.pos.add(Vector2D.from_polar(angles[downstream_i], this.mean_dist))

			// Compute this child's center angle as whatever the parent's position angle wound up as
			let furtherdown_center = angles[downstream_i]
			this._setup_kinematics_position(
				downstream_node,
				furtherdown_center,
				furtherdown_range
			)
		})
	}

	/**
	 * Given configuration and data, solve this graph to produce a 2D coordinates for all nodes. The solution
	 * will be iterative in nature and could take some time depending on graph size.
	 */
	solve()
	{
		let n_steps = 0, t_start = Date.now()
		while(true)
		{
			let solved = this._solve_step()

			if(solved) break;

			if(n_steps > 5000)
			{
				throw new Error("Hit max steps when solving.")
			}

			n_steps++
		}
		this._solution_time_ms = Date.now() - t_start
	}

	/**
	 * Solve a single step of the simulation.
	 * 
	 * @returns {Boolean} True if solution is stable
	 */
	_solve_step()
	{
		// First off compute the step time such that relative movement is not too far.
		let step = .1, max_vel = 0
		Object.values(this.nodes).forEach((node)=>
		{
			max_vel = Math.max(Math.abs(node.vel.magnitude), max_vel)
		})
		// If computed step is smaller, set step to it.
		if(max_vel > 0)
		{
			let computed_step = this.step_max_movement / max_vel
			step = Math.min(computed_step, step)
		}

		// Then apply this step to the kinematics
		let net_forces = this._solve_forces()
		let maxes = {rpos: new Vector2D(0, 0), rvel: new Vector2D(0, 0), acc: new Vector2D(0, 0)}
		Object.values(this.nodes).forEach((node)=>
		{
			// Do not move or process the base node.
			if(node.id == this.focal_point_id) return

			let net_force = net_forces[node.id]
			// Add in friction
			let f_friction = node.vel.mult_scalar(-1)
			net_force = net_force.add(f_friction)
			node.acc = net_force.mult_scalar(1 / node.wt)
			let rvel = node.acc.mult_scalar(step)
			node.vel = node.vel.add(rvel)
			let rpos = node.vel.mult_scalar(step)
			node.pos = node.pos.add(rpos)
			
			if(rpos.pysum > maxes.rpos.pysum) maxes.rpos = rpos
			if(rvel.pysum > maxes.rvel.pysum) maxes.rvel = rvel
			if(node.acc.pysum > maxes.acc.pysum) maxes.acc = node.acc
		})

		// Check if a break is appropriate
		let maxv = this.step_break_thresh**2
		if(maxes.rpos.pysum < maxv && maxes.rvel.pysum < maxv && maxes.acc.pysum < maxv)
		{
			return true
		}
		return false
	}

	/**
	 * Determine the net force on each node given current position.
	 * 
	 * @returns {Object} ID-map of node to net force vector.
	 */
	_solve_forces()
	{
		let net_forces = {}
		Object.values(this.nodes).forEach((node)=>
		{
			let forces = []
			// Compute all mass forces
			Object.values(this.nodes).forEach((other_node)=>
			{
				if(node.id == other_node.id) return

				forces.push(
					this.fvec_mass_get(node, other_node)
				)
			})
			// Compute all edge forces
			node.edges_orig.forEach((edge)=>
			{
				forces.push(
					this.fvec_bond_get(edge)
				)
			})
			node.edges_term.forEach((edge)=>
			{
				forces.push(
					this.fvec_bond_get(edge).mult_scalar(-1)
				)
			})

			net_forces[node.id] = Vector2D.sum(forces)
		})

		return net_forces
	}

	/**
	 * Get the force vector that exists between N1 and N2 on the basis of the edge from N1 to N2. This will
	 * not account for any edges from N2 to N1 (edges are directional).
	 * 
	 * The signs of resulting force are relative to N1. If N2 is located up and to the right of N1, then the
	 * attractive force pulling the two together will have positive x and y.
	 * 
	 * F_bond = bond_str * K_bond * R
	 * That is, bond force increases with the strength of the bond and distance between nodes.
	 * 
	 * @param {Object} edge The edge between N1 and N2
	 * 
	 * @returns {Vector2D} Resulting force vector, signs relative to N1
	 */
	fvec_bond_get(edge)
	{
		let v_12 = new Vector2D(
			edge.node_term.pos.x - edge.node_orig.pos.x,
			edge.node_term.pos.y - edge.node_orig.pos.y
		)
		return v_12.mult_scalar(this.K_bond * edge.wt)
	}

	/**
	 * Get the force vector that exists betweewn N1 and N2 on the basis of the mass of the two nodes.
	 * 
	 * The signs of resulting force are relative to N1. If N2 is located up and to the right of N1, then the
	 * repulsive force of the two masses will have negative x and y.
	 * 
	 * @param {Object} n1 The first node (e.g. perspective node)
	 * @param {Object} n2 The other node
	 * 
	 * @returns {Vector2D} Resulting force vector, signs relative to N1
	 */
	fvec_mass_get(n1, n2)
	{
		let v_12 = new Vector2D(n2.pos.x - n1.pos.x, n2.pos.y - n1.pos.y)
		return v_12.mult_scalar(-1 * this.K_mass * ((n1.wt + n2.wt) / (v_12.x**2 + v_12.y**2)))
	}

	/**
	 * Get a flat list of edges for this node. The list will be composed of objects that seem similar to edge
	 * references, but are in fact not the literal edge reference objects. Changing these objects will NOT
	 * alter network.edges. Object form:
	 * 
	 * ```
	 * {
	 *      other_node_id: int,
	 *      wt: int,
	 *      double: bool
	 * }
	 * ```
	 * 
	 * @param {Object} node Node reference
	 * 
	 * @returns {Array} List of edges, flat.
	 */
	node_get_flat_edges(node)
	{
		// UNTESTED
		let other_nodes = {}
		node.edges_orig.forEach((edge)=>
		{
			other_nodes[edge.node_term.id] = {
				other_node_id: edge.node_term.id,
				wt: edge.wt,
				double: false,
			}
		})
		node.edges_term.forEach((edge)=>
		{
			if(other_nodes[edge.node_orig.id] == undefined)
			{
				other_nodes[edge.node_orig.id] = {
					other_node_id: edge.node_orig.id,
					wt: edge.wt,
					double: false,
				}
				
			}
			else
			{
				other_nodes[edge.node_orig.id].wt += edge.wt
				other_nodes[edge.node_orig.id].double = true
			}
		})
		return Object.values(other_nodes)
	}

	/**
	 * Get a 'flat' list of edges. This list has no 'doubled' edges (e.g. two different edges for each in a
	 * bidirectional connection). The returned objects are dereferenced.
	 * 
	 * ```
	 * {
	 *     node_id_1: int
	 *     node_id_2: int
	 *     wt: int
	 *     double: bool
	 * }
	 * ```
	 * 
	 * @returns {Array} Of objects of above form
	 */
	edges_get_flat()
	{
		let out = []
		Object.values(this.edges).forEach((edge)=>
		{
			let edgeref = {
				node_id_1: edge.node_orig.id,
				node_id_2: edge.node_term.id,
				wt: edge.wt,
				double: false
			}
			// Check for double
			Object.values(this.edges).forEach((edge_inner)=>
			{
				if(edge.id == edge_inner.id) return
				if(edge.node_orig.id == edge_inner.node_term.id && edge.node_term.id == edge_inner.node_orig.id)
				{
					edgeref.wt += edge_inner.wt
					edgeref.double = true
				}
			})
			out.push(edgeref)
		})
		return out
	}

	/**
	 * Get a new network that's composed of a subset of this one from the focal point out to a certain order.
	 * If max_order = 1, then the returned network would have the focal point and all 1st order nodes.
	 * 
	 * @param {Number} max_order Maximum order of node to have in returned network.
	 * 
	 * @returns {Network} Instantiated but unsolved
	 */
	subnetwork_get(max_order)
	{
		let nodes = {}, edges = {}
		
		Object.values(this.nodes).forEach((node)=>
		{
			if(node.order > max_order) return

			// Does not need to be dereferenced.
			nodes[node.id] = node

			node.edges_orig.forEach((edge)=>
			{
				if(edge.node_term.order <= max_order)
				{
					edges[edge.id] = edge
				}
			})
			node.edges_term.forEach((edge)=>
			{
				if(edge.node_orig.order <= max_order)
				{
					edges[edge.id] = edge
				}
			})
		})

		return new Network(nodes, edges, this.focal_point_id, this.mean_dist)
	}

	/**
	 * Given a span and a number of points, position those points within the span similar to the flexbox
	 * space-between ruling. If there's only one point, it will be centered.
	 * 
	 * @param {Number} start Start of span
	 * @param {Number} end End of span
	 * @param {Number} n Number of points
	 * 
	 * @returns {Array} Of point positions in span
	 */
	static space_between(start, end, n)
	{
		if(n <= 0) throw new Error("n must be > 1")
		if(start >= end) throw new Error("must describe a range")
		if(n == 1) return [((start + end) / 2)]
		let out = [],
			spacing = (end - start) / (n - 1)
		for(let i = 0; i < n; i++)
		{
			out.push(start + (i * spacing))
		}
		return out
	}

	/**
	 * This method exists, currently, so that checksums can be made off it. So only renderable data need be
	 * preserved.
	 */
	toJSON()
	{
		let data = {
			'nodes': [],
			'edges': []
		}
		Object.values(this.nodes).forEach((node)=>
		{
			data.nodes.push({
				id: node.id,
				x: node.pos.x,
				y: node.pos.y,
				wt: node.wt,
			})
		})
		Object.values(this.edges).forEach((edge)=>
		{
			data.nodes.push({
				id: edge.id,
				nid_orig: edge.nid_orig,
				nid_term: edge.nid_term,
				wt: edge.wt,
			})
		})
		return data
	}
}

export { Network }