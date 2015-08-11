# Development

## Directory structure

```
PROJECT_ROOT
------------
 |-- package.json  // npm package and dependency definitions
 |-- gulpfile.js   // configuration file for the gulp build system
------------
 |-- API.md        // back end API *specification*
 |-- Dev.md        // this file
 |-- README.md     // general readme and setup instructions
------------
 |-- server.js     // express-based server application ("the back end")
 |-- api_routes.js // (reverse) route definitions for the backend API (more info below)
 |-- ui_routes.js  // (reverse) route definitions for the front end (more info below)
 |-- index.js      // HTML bootstrap code (more info below)
------------
 |-- assets        // application assets that will be compiled to the "public" folder (e.g. less files)
 |-- config        // configuration files
 |-- models        // database schemas
 |-- public        // compiled assets for web server delivery
 |-- routes        // route definitions and handler methods (i.e. the backend business logic and API)
 |-- scripts       // administration scripts
 |-- static        // static resources (copied to public by grunt)
 |-- util          // utility javascript files
 |-- views         // views to be rendered by backend or frontend
     |-- jsx       // JSX (react components) sources
```

## gulp tasks

 * ```default```: execute this when developing (see below, uses multiple of the tasks below in
   parallel/sequence)
 * ```build```: builds the tool for production deployment
 * ```clean```: removes last build
 * ```api```: builds and serves the REST API documentation and opens it in a browser
 * ```test```: runs unit tests using [Jasmine](http://jasmine.github.io/)

## building (dev mode)

Install gulp if you haven't done so yet:
```
npm install -g gulp
```

Then, run:

```
gulp
```

Gulp will then:
 * Check code styles according to the Google JavaScript coding conventions using jscs and eslint
 * Compile assets (e.g. less files) from ```assets``` to ```public```
 * Copy static files from ```static``` to ```public```
 * Compile ES6 and JSX view sources to ```public```
 * Watch sources for changes, recompile on changes and automatically reload (the changed files) in
   the browser (see below)
 * Run express web server at http://localhost:8080 (depending on values in ```config/config.js```)

For building the project for deployment in a production environment run ```gulp deploy``` instead.

## livereload

The gulpfile is set up with [livereload](https://github.com/vohof/gulp-livereload) feature (i.e. Chrome can automatically reload changed files upon notification by a gulp plugin!!!). For the feature to work install the [Chrome livereload extension](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei) and
activate livereload on the locally opened site (click livereload plugin icon on the top right of the browser window).

## react and react-router

The user interface is a single page application built with [React](http://facebook.github.io/react/)
and [react-router](https://github.com/rackt/react-router). There's a lot of documentation out there about how React works and once you wrapped your head around it it's incredibly easy and powerful.

**single-page app**

All views that a user can navigate to are defined in ```views/jsx/Routes.jsx```. The file ```views/jsx/Scaffold.jsx``` contains the navigation bar and the boilerplate to switch different content pages. Please take a look at [react-router](https://github.com/rackt/react-router) and [react-router-bootstrap](https://github.com/react-bootstrap/react-router-bootstrap) to learn how to use it (or simply check out some other code or ask us).

## route files (api_routes.js and ui_routes.js)

Take a look at ```api_routes.js``` and ```ui_routes.js```. These files contain all routes that are available within the application (on the REST API and the user front end, respectively). E.g., on server side express-routes are defined by accessing route names in ```api_routes.js```:

```
// api_routes.js
var api_routes = [
  // ...
  'scenario_by_uuid' : '/api/v1/scenarios/:uuid/?',
  // ...
];
```

Then in the express app we reference a route by using its name ('scenario_list'):

```
// routes/api/v1/api.js
var api = require('../../../api_routes.js');

router.get(api.route('scenario_by_uuid'), function(req, res)) {
  // ...
};
```

On the front end side if we want to call the service we use the ```api_routes.js``` functionality to
generate a reverse route:

```
// views/jsx/scenarios/ScenarioList.jsx
import api from '../../../../api_routes.js'
// ...

var ScenarioList = React.createClass({
  // ...
  componentDidMount : function() {
    var url = api.reverse(
      'scenario_by_uuid',
      { uuid : 'weiQuio5boo' },
      { orderBy : 'timestamp', orderDir : 'asc' }
    );
    $.ajax(url, { ... })
  }
  // ...
});
```

The call to ```api.reverse(...)``` will then result in ```'/api/v1/scenarios/weiQuio5boo?orderBy=timestamp&orderDir=asc'```. The rationale behind all this is that we have a central place for route definitions that makes it easy to lookup (!), define and modify routes without search / replace throughout the whole code base when we want to change something.

## less-based styling

We use [less](http://lesscss.org/) to style the application. The idea is to give DOM elements "domain-specific" class names, e.g.,

```
<table class="scenarioTable">
  ...
</table>
```

Then, in the less file we can, e.g., inherit styles from other sources (such as [bootstrap](http://getbootstrap.com/)) using the less inheritance features:

```
.ocTable {
  .table;
  .table-striped;
  .table-bordered;
  .table-hover;
}

.scenarioTable {
  .ocTable;
}
```

This way, HTML markup and styling are better separated and styling should become simpler later on.

## coding conventions

We use (a slightly modified version of) the Google JavaScript coding conventions. These are checked
during build and development to enable (besides other things):

 * nice diffs when comparing commits,
 * easier-to-read code
 * less errors

To make your "IDE" follow the coding conventions (we use Brackets, Atom and sometimes vim), take a
look at [editorconfig](http://editorconfig.org/). There's an .editorconfig file checked into the repository.

## HTML bootstrap

In order to realize a single page application all requests (that are *not* part of the HTTP API) are
served by a catch all route defined in ```server.js```:

```
var index = require('index.js');
var catchAllRoute = contextPath + '*';
app.get(catchAllRoute, function(req, res) {
  res.status(200).send(index);
});
```

This single page never changes and loads the single page app (```build/static/js/App.js```) that is
a bundled version of all React .jsx files in ```views/jsx/```. Then, after this intial bootstrapping
react-router (see above) takes over and uses the Browser history API to realize a single-page app
that feels like server-rendered but fast and responsive.

## TODOs
 * Take a look at how search engines see our single page app. The blogosphere says React is great
   for search engine optimization as you can always render it on server side as well (this would
   have to be set up first, not done yet).

## Nice-to-Haves
 * Build unit test with [Jest](https://facebook.github.io/jest/)
 * Allow executing unit tests with [Karma](http://karma-runner.github.io/)
