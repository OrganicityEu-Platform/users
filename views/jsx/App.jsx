import $                from 'jquery';
import React            from 'react';
import Scaffold         from './Scaffold.jsx';
import ScenarioListView from './scenarios/ScenarioList.jsx';
import ScenarioView     from './scenarios/ScenarioView.jsx';

var Router = require('react-router')
  , Route = Router.Route;

var routes = (
  <Route handler={Scaffold}>
    <Route name="scenarioList" path="scenarios"       handler={ScenarioListView} />
    <Route name="scenarioView" path="scenarios/:uuid" handler={ScenarioView}     />
  </Route>
);

$(function(){
  Router.run(routes, Router.HistoryLocation, function(Root) {
    React.render(<Root />, document.body);
  });
});
