# Development

To do the development, please follow the [installation instructions](Install.md) first, before you continue here.

## gulp tasks

 * `default`: execute this when developing (see below, uses multiple of the tasks below in
   parallel/sequence)
 * `build`: builds the tool for production deployment
 * `clean`: removes last build
 * `api`: builds and serves the REST API documentation and opens it in a browser
 * `pdf`: Renders all Mardown files under `doc/` to PDF files
 * `test`: runs unit tests using [Jasmine](http://jasmine.github.io/)
 * `lint`: Check code styles according to the Google JavaScript coding conventions using **jscs** and **eslint**

## building (dev mode)

Install gulp if you haven't done so yet:

```
npm install -g gulp
```

Then, run:

```
npm install
gulp
```

Gulp will then:

 * Check code styles according to `gulp lint`
 * Compile assets (e.g. less files) from `assets` to `public`
 * Copy static files from `static` to `public`
 * Compile ES6 and JSX view sources to `public`
 * Watch sources for changes, recompile on changes and automatically reload (the changed files) in
   the browser (see below)
 * Run express web server at http://localhost:8080 (depending on values in `config/config.js`)

For building the project for deployment in a production environment run `gulp deploy` instead.

## livereload

The gulpfile is set up with [livereload](https://github.com/vohof/gulp-livereload) feature
(i.e. the browsers can automatically reload changed files upon notification by a gulp plugin!!!).

For the feature to work install the browser extensions:

* [Chrome livereload extension](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei) and
activate livereload on the locally opened site (click livereload plugin icon on the top right of the browser window).
* [Firefox livereload extension](http://download.livereload.com/2.0.8/LiveReload-2.0.8.xpi)
* [Safari livereload extension](http://download.livereload.com/2.0.9/LiveReload-2.0.9.safariextz)

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

Then in the express app we reference a route by using its name (`scenario_by_uuid`):

```
// routes/api/v1/api.js
var api = require('../../../api_routes.js');

router.get(api.route('scenario_by_uuid'), function(req, res)) {
  // ...
};
```

On the front end side if we want to call the service we use the `api_routes.js` functionality to
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
look at:
* [editorconfig](http://editorconfig.org/)
* [JSCS](http://jscs.info/)
* [ESLint](http://eslint.org/)

There are corresponding config files checked into the repository (e.g., `.editorconfig`, `.jscsrc` and `.eslintrc`.
You can also configure your "IDE", such it can do live checks for EditorConfig, JSCS and ESLint.

## HTML bootstrap

In order to realize a single page application all requests (that are *not* part of the HTTP API) are
served by a catch all route defined in `server.js`:

```
var index = require('index.js');
var catchAllRoute = contextPath + '*';
app.get(catchAllRoute, function(req, res) {
  res.status(200).send(index);
});
```

This single page never changes and loads the single page app (`build/static/js/App.js`) that is
a bundled version of all React .jsx files in `views/jsx/`. Then, after this intial bootstrapping
react-router (see above) takes over and uses the Browser history API to realize a single-page app
that feels like server-rendered but fast and responsive.

## TODOs
 * Take a look at how search engines see our single page app. The blogosphere says React is great
   for search engine optimization as you can always render it on server side as well (this would
   have to be set up first, not done yet).

## Nice-to-Haves
 * Build unit test with [Jest](https://facebook.github.io/jest/)
 * Allow executing unit tests with [Karma](http://karma-runner.github.io/)
