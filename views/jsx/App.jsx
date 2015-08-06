import $          from 'jquery';
import React      from 'react';
import routes     from './Routes.jsx';

var Router = require('react-router')
  , Route = Router.Route;

$(function(){
  Router.run(routes, Router.HistoryLocation, function(Root) {
    React.render(<Root />, document.body)
  });
});
