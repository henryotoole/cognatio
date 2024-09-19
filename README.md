Cognatio is a web application that provides a sort of framework for both public and private non-heirarchal writing.

The ultimate strategic goal of the project is to allow an individual to create an extension of their own mind - a library of sorts. This goal is straightforwards and does not *require* a web application. It could even be done on paper. However, the automation advantages of information machinery are extensive and the access enabled by the internet is unparalleled.

Tactically speaking, cognatio allows the "owner" of the system to quickly create and modify what is effectively a simple website. Some restrictions are imposed by cognatio in order to allow sensible interaction of cognatio code with the resulting work. For example, all 'pages' in the site must be in a flat directory. This compromise in structure is neccessary so that other facets of use can remain uncompromised. These facets are primarily editing on the writing side and navigation on the reading side.

**Editing**
Editing can be achieved either directly by adding and editing files in the cognatio filestructure or via the Navigator client that ships with cognatio. Editing with a text editor (such as VSCode) will naturally be far more powerful, but also restricted as the client machine will need SSH keys or some similar component of a development operation. Editing with the Navigator won't have all the advantages of a real development text editor but can be done from any web browser with traditional login credentials.

**Navigating**
A key aspect of cognatio is a similar treatment of both inbound and outbound links. Outbound links are usually clearly visible in the body of a page as an <a> tag. However, inbound links are effectively invisible. Cognatio keeps track of all *internal* inbound links for each page (and perhaps one day will do so for links from external sites as well) so that relations between pages can be more clearly observed.

**TODO**
This document will need much editing as this project is used and feedback alters its state. At least for the time being this project is pretty personal and aims to suit only the needs of myself and a couple friends who use it.

Some specifics for this document
+ Write installation instructions
+ Better clarity of what this actually is

General for project:
+ External links and external sites
+ Feedback-cycle 'markup' for pages in raw html. "Addons"