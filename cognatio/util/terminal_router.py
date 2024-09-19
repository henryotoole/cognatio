"""
A helpful class which makes it easy to map a set of ultimately callable functions out so that they
may be navigated across within a terminal.

Development note: I ultimately wish for this to wind up in hacutils. However, I don't yet know where
need will take this project. Until then, copies of it float around my various projects and accrue
more features.
"""
__author__ = "Josh Reed"

# Our code

# Other libs
from hacutils.term import input_get_choice

# Base python

class TerminalRouter:
    
	def __init__(self):
		"""Create a new TerminalRouter instance.
		"""

		self.nodes = {
			'base': {'parent_node': None, 'fn': None}
		}
		self.nodes_children = {}
		self._nodes_update()

	def bind_function(self, node_name: str, parent_node_name: str):
		def subdecorator(fn):
			self.add_node(node_name, parent_node_name, fn=fn)
		return subdecorator

	def add_node(self, node_name: str, parent_node_name: str, fn=None):
		"""Add a new node to the router. This must have a unique name and a parent node to which to which
		it belongs. If a function is provided, it will be executed when this node is reached (and before
		sub-nodes are listed for selection).

		The parent node does not have to exist yet for this to be recorded, but no check is done to ensure
		that no orphaned nodes exist.

		Args:
			node_name (str): The name of the node
			parent_node_name (str): The name of the parent node
			fn (function, optional): If provided, function to be executed.

		Raises:
			ValueError if the node already exists
		"""
		if not parent_node_name in self.nodes:
			raise ValueError("Parent node '" + str(parent_node_name) + "' does not exist.")
		
		if node_name in self.nodes:
			raise ValueError("Node '" + str(node_name) + "' already exists.")
		
		self.nodes[node_name] = {'parent_node': parent_node_name, 'fn': fn}

		self._nodes_update()

	def _nodes_update(self):
		"""Convert self.nodes into self.nodes_children for traversal.
		"""
		self.nodes_children = {}
		for node_name, node in self.nodes.items():
			# Base case
			if not node_name in self.nodes_children:
				self.nodes_children[node_name] = []

			# Parent specified case
			pnode = node['parent_node']
			if not pnode in self.nodes_children:
				self.nodes_children[pnode] = []
			self.nodes_children[pnode].append(node_name)

	def terminal_start_traversal(self):
		"""Start the traversal of nodes from the top level (base) node in the terminal.
		"""
		current_node = 'base'
		while True:

			if self.nodes[current_node]['fn'] is not None:
				self.nodes[current_node]['fn'](self)
			
			if len(self.nodes_children[current_node]) == 0:
				break
			
			current_node = self.nodes_children[current_node][
				input_get_choice(self.nodes_children[current_node])
			]