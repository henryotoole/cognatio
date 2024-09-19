"""
The goal of a web/schema is to merge the two pathways that might access the data through a REST API.
The first is the REST API itself via flask routes. The second is pytest, to test the data access methods.

Everything that's *worth testing* should be downstream of the WhateverSchema class. Upstream functionality
should really just be minimum-possible boilerplate and docstrings for Swagger.

Graphically, the flow of execution is as follows:

```
pytest -------------> Schema -----------------------------> SQLAlchemy Model --> SQL
                    ^  + Creates DAO behavior             + cognatio/core        Server
				    |  + Marshmallow for serialization    + DB Access
				    |  + Marshmallow for validation       
                    |  + Does not use flask app context   
REST API -> Flask  -/
            Routes
            + Setup by FRSA Spur.
			+ Uses flask app context
```
"""
__author__ = "Josh Reed"

# Our code
from cognatio.web.schemas.page import PageSchema
from cognatio.web.schemas.user import UserSchema
from cognatio.web.schemas.edge import EdgeSchema
from cognatio.util.dr_hitch.frsa_spur import FRSASpur

# Other libs

# Base python

# Current api version and route
api_route = "/api/v1"

# Schema instances
schema_page = PageSchema()
schema_user = UserSchema(exclude=['passhash'])
schema_edge = EdgeSchema()

# Bind all into the FRSASpur instance
frsa_spur = FRSASpur("Cognatio", "0.1.0", api_route)
frsa_spur.register_schema(schema_page)
frsa_spur.register_schema(schema_user)
frsa_spur.register_schema(schema_edge)