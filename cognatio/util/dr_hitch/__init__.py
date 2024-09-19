"""
This is Dr. Hitch. It connects things together with approximately the average bother of connecting a trailer
to the average truck trailer hitch.

Dr. Hitch aims to complete the critical last leg of automation between Marshmallow schema's, SQL alchemy, and
a REST API exposed on Flask and adhering to OpenAPI. This task is somewhat conditional and I suspect that
any attempt to do it truly universally will result in frustration. This small library is my own take on this
problem and tailored to my own needs. Perhaps some other person with similar needs might use it one day.

The goal of a web/schema is to merge the two pathways that might access the data through a REST API.
The first is the REST API itself via flask routes. The second is pytest, to test the data access methods.

Everything that's *worth testing* should be downstream of the WhateverSchema class. Upstream functionality
should really just be minimum-possible boilerplate and docstrings for Swagger.

Graphically, the flow of execution is as follows:

```
.. highlight:: python
.. code-block:: text

#                                 +--( SchemaRFS )--------> File System
#                                 |                         + Upload and download
#                                 |                         
#                                 |                         
# pytest -------------> Schema ---+--( SchemaRSA )--------> SQLAlchemy Model
#                     ^  + Creates DAO behavior             + cognatio/core
#                     |  + Marshmallow for serialization    + DB Access
#                     |  + Marshmallow for validation       
#                     |  + Does not use flask app context   
#                     |  + **Validates** user
# REST API -> Flask  -/
#             Routes
#             + Setup by FRSA Spur.
#             + Uses flask app context
#             + **Authenticates** user
			
```
"""
__author__ = "Josh Reed"

from cognatio.util.dr_hitch.schema import SchemaREST
from cognatio.util.dr_hitch.schema_rsa import SchemaRSA
from cognatio.util.dr_hitch.schema_rfs import SchemaRFS