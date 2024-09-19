"""
Random little math bits needed for the project.
"""
__author__ = "Josh Reed"

# Our code

# Other libs

# Base python
import math



def obfuscate_id(id: int, hash_len: int) -> str:
	"""Obfuscate the provided ID into a short string that will be unique to the ID and difficult to compare
	to other ID-hashes. For example, the hashes for 6, 7, and 8 will not apparently be in order. However, a
	determined individual with even half a brain could likely work out the conversion method with some effort.
	This isn't security, just a facade.

	In a nutshell, this function 'rotates' id across the max range of ID's possible (given hash_len) every
	four ID values. In other words, convert:

	```
	0, 1, 2, 3, 4, 5
	to
	0, (1/4)MAX + 1, (2/4)MAX + 1, (3/4)MAX + 1, (4/4)MAX + 1, (1/4)MAX + 2, ...
	```
	And then convert that to hex.

	Args:
		id (int): The ID, an integer number.
		hash_len (int): The number of characters in the hash. This will limit the max ID

	Returns:
		str: A string-hash that's unique to the provided ID.
	"""
	# Max number of digits
	id_max = 16**hash_len
	x = id
	# Dividing 16^N by 4 is always itself a factor of 16^N
	spacer = (id_max // 4)

	# Shuffle the deck procedurally
	y = math.floor((spacer*x)/id_max) + ((spacer*x) % id_max)

	# Reverse order, why not?
	z = id_max - (y + 1)

	# Then convert to delicious hex string
	hstr = hex(z)[2:].rjust(hash_len, '0')

	#print(f"{x} -> {y} -> {z} -> {hstr}")

	return hstr