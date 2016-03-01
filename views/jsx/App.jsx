import $          from 'jquery';
import React      from 'react';
import routes     from './Routes.jsx';

import ga_config  from '../../config/ga.js';

console.log(ga_config);

var Router = require('react-router');
var Route = Router.Route;

var ga = require('react-ga');

$(function() {
  // Google Analytics
  var options = { debug: true };
  ga.initialize('UA-74522426-1', options);

  Router.run(routes, Router.HistoryLocation, function(Handler, state) {

    // track page views
    if(ga_config.debug) {
      console.log('State:', state);
    }
    var options = {
       debug: ga_config.debug
    };
    ga.initialize(ga_config.id, options);

    // Render page
    React.render(<Handler/>, document.body);
  });
});
