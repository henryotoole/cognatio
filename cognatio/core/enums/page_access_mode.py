"""
Enum for access mode for page permissions
"""
__author__ = "Josh Reed"

# Our code

# Other libs

# Base python
from enum import Enum


class PageAccessMode(int, Enum):

	PUBLIC = 0
	SHARED = 1
	PRIVATE = 2