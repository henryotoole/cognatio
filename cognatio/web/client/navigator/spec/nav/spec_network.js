/**
 * @file Test the Network graph algorithm class.
 * @author Josh Reed
 */

import { Fabricator } from "regional"
import { Network, Vector2D } from "nav"

describe("Network", function()
{
	let nodes = {
		1: {id: 1, wt: 1},
		2: {id: 2, wt: 1},
		3: {id: 3, wt: 1},
		4: {id: 4, wt: 1},
		5: {id: 5, wt: 1},
		6: {id: 6, wt: 1},
	}
	let edges = {
		// 0th: Connect 1 to 2, 3
		1: {id: 1, wt: 1, nid_orig: 1, nid_term: 2},
		2: {id: 2, wt: 1, nid_orig: 1, nid_term: 3},
		// 1st: Connect 2 to 4, 5
		3: {id: 3, wt: 1, nid_orig: 2, nid_term: 4},
		4: {id: 4, wt: 1, nid_orig: 2, nid_term: 5},
		// 1st: Connect 3 to 6
		5: {id: 5, wt: 1, nid_orig: 3, nid_term: 6},
		// 2nd: Connect 5 to 6
		6: {id: 6, wt: 1, nid_orig: 5, nid_term: 6},
		// Curveball, backreference 2 to 1
		7: {id: 7, wt: 1, nid_orig: 2, nid_term: 1},
	}

	it("Cuts references", function()
	{
		let network = new Network(nodes, edges, 1)
		network.nodes[1]['boo'] = 'fox'
		expect(nodes[1]['boo']).toEqual(undefined)
	})

	it("Can properly crosslink edges", function()
	{
		let network = new Network(nodes, edges, 1)

		// Random sample, not exhaustive
		expect(network.nodes[2].edges_orig.length).toEqual(3)
		expect(network.nodes[2].edges_orig[0].node_orig.id).toEqual(2)
		expect(network.nodes[2].edges_orig[0].node_term.id).toEqual(4)
		expect(network.nodes[2].edges_orig[1].node_orig.id).toEqual(2)
		expect(network.nodes[2].edges_orig[1].node_term.id).toEqual(5)
		expect(network.nodes[2].edges_orig[2].node_orig.id).toEqual(2)
		expect(network.nodes[2].edges_orig[2].node_term.id).toEqual(1)
	})

	it("Can properly order nodes", function()
	{
		let network = new Network(nodes, edges, 1)
		let orders = {
			1: 0,
			2: 1,
			3: 1,
			4: 2,
			5: 2,
			6: 2
		}
		Object.entries(network.nodes).forEach(([id, data])=>
		{
			expect(data.order).toBe(orders[id])
		})
	})

	it("Will autoremove isolated nodes", function()
	{
		let nodes_w_isolated = JSON.parse(JSON.stringify(nodes))
		nodes_w_isolated[99] = {id: 99, wt: 1}
		let network = new Network(nodes, edges, 1)
		expect(network.nodes[99]).toEqual(undefined)
	})

	it("Can position initial seed", function()
	{
		/* Seed will appear as:
											|
											|
								(5)			|
								 |			|
		(6)	---	(3)	---	(1)	---	(2)			|
								 |			|
								(4)			|
											|
											|
		*/
		let network = new Network(nodes, edges, 1)
		//Object.entries(network.nodes).forEach(([id, data])=>
		//{
		//	console.log(`Node ${id} is at ${data.pos.x}, ${data.pos.y}`)
		//})
		expect(network.nodes[1].pos.at(0, 0, 0.1)).toBe(true)
		expect(network.nodes[2].pos.at(1, 0, 0.1)).toBe(true)
		expect(network.nodes[3].pos.at(-1, 0, 0.1)).toBe(true)
		expect(network.nodes[4].pos.at(1.707, -0.707, 0.1)).toBe(true)
		expect(network.nodes[5].pos.at(1.707, 0.707, 0.1)).toBe(true)
		expect(network.nodes[6].pos.at(-2, 0, 0.1)).toBe(true)
	})

	it("Can solve", function()
	{
		//let nodes = {
		//	1: {id: 1, wt: 1},
		//	2: {id: 2, wt: 1},
		//}
		//let edges = {
		//	1: {id: 1, wt: 1, nid_orig: 1, nid_term: 2},
		//}
		let network = new Network(nodes, edges, 1)
		// Set this to true to show the solution occurring and tinker.
		let show_solution = true

		let css = /* css */`
			.toplevel {
				& .holder {
					position: absolute;
					top: 100px; left: 100px;
					width: 1000px; height: 1000px;
					background-color: transparent;
					overflow: hidden;
				}
				& .node {
					top: 0; left: 0;
					position: absolute;
					width: 0px; height: 0px;
				}
				& .node-inner {
					top: -7px; left: -7px;
					position: absolute;
					border-radius: 10px;
					width: 14px; height: 14px;
					background-color: black;
					color: white;
					display: flex; align-items: center; justify-content: center;
					font-size: 0.75em;
				}
				& .edge {
					position: absolute;
					top: 0; left: 0;
					width: 0px; height: 0px;
				}
				& .edge-inner {
					position: relative;
					top: -1px;
					height: 2px;
					background-color: black;
				}
			}
		`
		let html = /* html */`
		<div id="holder" class='holder' style='display: none'>
		</div>
		`
		let fab = new Fabricator(html).add_css_rule(css)
		fab.fabricate()
		document.getElementsByTagName("body")[0].classList.add("toplevel")
		fab.append_to(document.getElementsByTagName("body")[0])

		let holder = document.getElementById("holder")
		Object.values(network.edges).forEach((edge)=>
		{
			let html = /* html */`
			<div id='e${edge.id}' class='edge'>
			<div id='ei${edge.id}' class='edge-inner'>
			</div>
			</div>
			`
			let fab = new Fabricator(html)
			fab.fabricate()
			fab.append_to(holder)
		})
		Object.values(network.nodes).forEach((node)=>
		{
			let html = /* html */`
			<div id='n${node.id}' class='node'>
			<div id='ni${node.id}' class='node-inner'>${node.id}
			</div>
			</div>
			`
			let fab = new Fabricator(html)
			fab.fabricate()
			fab.append_to(holder)
		})

		let npos = (vec)=>
		{
			let center = new Vector2D(500, 500)
			let pos = center.add(vec.mult_scalar(50))
			return pos
		}
		let render = ()=>{
			Object.values(network.nodes).forEach((node)=>
			{
				let el = document.getElementById(`n${node.id}`)
				let pos = npos(node.pos)
				el.style.transform = `translate(${pos.x}px, ${pos.y}px)`
			})
			Object.values(network.edges).forEach((edge)=>
			{
				let el = document.getElementById(`e${edge.id}`)
				let elinner = document.getElementById(`ei${edge.id}`)
				let p1 = npos(edge.node_orig.pos)
				let p2 = npos(edge.node_term.pos)
				let pc = p1.add(p2).mult_scalar(0.5)
				let dir = p2.add(p1.mult_scalar(-1))
				el.style.transform = `translate(${pc.x}px, ${pc.y}px) rotate(${dir.theta}rad)`
				elinner.style.width = `${dir.magnitude}px`
				elinner.style.left = `-${dir.magnitude/2}px`
			})
		}
		let i = 0
		let step = ()=>
		{
			let solved = network._solve_step()
			render()
			if((!solved) && (i < 10000))
			{
				window.setTimeout(step, 10)
			}
			i++
		}
		
		if(show_solution)
		{
			holder.style.display = "flex"
			step()
		}
	})

	it("can linspace", function()
	{
		expect(Network.space_between(5, 7, 1)).toEqual([6])	
		expect(Network.space_between(5, 7, 2)).toEqual([5, 7])	
		expect(Network.space_between(5, 7, 3)).toEqual([5, 6, 7])	
	})
})

describe("Vector", function()
{
	it("Can evaluate quality with tolerance", function()
	{
		let v1 = new Vector2D(1000, 1000),
			v2 = new Vector2D(1000.0001, 1000)

		expect(v1.equals(v2)).toBe(false)
		expect(v1.equals(v2, 0.001)).toBe(true)
	})
})