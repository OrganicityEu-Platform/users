import $                from 'jquery';
import React            from 'react';
import routes           from './Routes.jsx';

var Router = require('react-router')
  , Route = Router.Route;

var printError = function(jqXHR, textStatus, errorThrown) {
  console.log('jqXHR', jqXHR);
  console.log('textStatus', textStatus);
  console.log('errorThrown', errorThrown);
  $(document.body)
      .append('<h1>Error</h1>')
      .append('<h2>jqXHR</h2>')
      .append('<pre>' + JSON.stringify(jqXHR) + '</pre>')
      .append('<h2>textStatus</h2>')
      .append('<pre>' + textStatus + '</pre>')
      .append('<h2>errorThrown</h2>')
      .append('<pre>' + errorThrown + '</pre>');
}

var render = function() {
  Router.run(routes, Router.HistoryLocation, function(Root) {
    React.render(<Root />, document.body);
  });
}

$(function(){
  $.ajax('/api/v1/auth/currentUser', {
    accepts : 'application/json',
    success : function(data, textStatus, jqXHR) {
      window.currentUser = data;
      render();
    },
    error : function(jqXHR, textStatus, errorThrown) {
      if (jqXHR.status == 404) {
        window.currentUser = null;
        render();
      } else {
        printError(jqXHR, textStatus, errorThrown);
      }
    }
  });
});
