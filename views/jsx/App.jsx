import $          from 'jquery';
import React      from 'react';
import routes     from './Routes.jsx';

var Router = require('react-router');
var Route = Router.Route;

$(function() {
  Router.run(routes, Router.HistoryLocation, function(Root) {
    React.render(<Root />, document.body);
  });
});
