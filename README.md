# OrganiCity Scenario Tool

Please note the main [documentation folder]() under `/doc`.

## Directory structure

```
PROJECT_ROOT
------------
 |-- package.json       // npm package and dependency definitions
 |-- gulpfile.js        // configuration file for the gulp build system
------------
 |-- README.md          // This file
 |-- doc/API.md         // back end API *specification*
 |-- doc/Development.md // Development instuctions (e.g., gulp)
 |-- doc/Install.md     // How to setup the use case tool
------------
 |-- server.js        // express-based server application ("the back end")
 |-- api_routes.js    // (reverse) route definitions for the backend API (more info below)
 |-- ui_routes.js     // (reverse) route definitions for the front end (more info below)
 |-- index.js         // HTML bootstrap code (more info below)
------------
 |-- assets           // application assets that will be compiled to the "public" folder (e.g. less files)
 |-- config           // configuration files
 |-- models           // database schemas
 |-- public           // compiled assets for web server delivery
 |-- routes           // route definitions and handler methods (i.e. the backend business logic and API)
 |-- scripts          // administration scripts
 |-- static           // static resources (copied to public by grunt)
 |-- util             // utility javascript files
 |-- views            // views to be rendered by backend or frontend
     |-- jsx          // JSX (react components) sources
```
