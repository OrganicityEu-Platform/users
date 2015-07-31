import React            from 'react';
import Scaffold         from './Scaffold.jsx';
import HomeView         from './HomeView.jsx';
import ScenarioListView from './scenarios/ScenarioList.jsx';
import ScenarioView     from './scenarios/ScenarioView.jsx';
import Login            from './auth/Login.jsx';
import LocalLogin       from './auth/LocalLogin.jsx';
import Signup           from './auth/Signup.jsx';
import Profile          from './auth/Profile.jsx';

var Router = require('react-router')
  , Route = Router.Route;

var routes = (
  <Route handler={Scaffold}>
    <Route name="home"         path="/?"                 handler={HomeView}         />
    <Route name="scenarioList" path="scenarios/?"        handler={ScenarioListView} />
    <Route name="scenarioView" path="scenarios/:uuid"    handler={ScenarioView}     />
    <Route name="login"        path="auth/login/?"       handler={Login}            />
    <Route name="local-login"  path="auth/local-login/?" handler={LocalLogin}       />
    <Route name="signup"       path="auth/signup/?"      handler={Signup}           />
    <Route name="profile"      path="auth/profile/?"     handler={Profile}          />
  </Route>
);

export default routes;
