import $          from 'jquery';
import React      from 'react';
import routes     from './Routes.jsx';

var Router = require('react-router');
var Route = Router.Route;

var ga = require('react-ga');
import ga_config  from '../../config/ga.js';

$(function() {
  // Google Analytics
  var options = { debug: true };
  ga.initialize(ga_config.id, options);

  Router.run(routes, Router.HistoryLocation, function(Handler, state) {

    // track page views
    if(ga_config.debug) {
      console.log('State:', state);
    }
    var options = {
       debug: ga_config.debug
    };
    ga.pageview(state.pathname);

    // Render page
    React.render(<Handler/>, document.body);
  });
});
