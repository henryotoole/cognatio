# tests/test_util_maths.py
# Josh Reed 2024
#
# Test maths util functions

# Our code
from cognatio.util import maths

# Other libs
import pytest

# Base python

def test_obfuscate_id():
	"""Full range of tests for maths.obfuscate_id
	"""

	n = 3
	out = []
	for x in range(16**n):
		hash = maths.obfuscate_id(x, n)
		out.append(int(hash, 16))
		assert len(hash) == n

	# Ensure all numbers are unique
	assert len(out) == len(set(out))
	for v in out:
		assert v < 16**n