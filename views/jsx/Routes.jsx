import React            from 'react';
import Scaffold         from './Scaffold.jsx';
import HomeView         from './HomeView.jsx';
import ScenarioListView from './scenarios/ScenarioList.jsx';
import ScenarioEditView from './scenarios/ScenarioEditView.jsx';
import ScenarioView     from './scenarios/ScenarioView.jsx';
import Login            from './auth/Login.jsx';
import Logout           from './auth/Logout.jsx';
import LocalLogin       from './auth/LocalLogin.jsx';
import Signup           from './auth/Signup.jsx';
import Profile          from './auth/Profile.jsx';
import SysInfo          from './SysInfo.jsx';
import ui               from '../../ui_routes.js';

var Router = require('react-router');
var Route = Router.Route;

var routes = (
  <Route handler={Scaffold}>
    <Route name="home"              path={ui.route('home')}           handler={HomeView}         />
    <Route name="scenarioList"      path={ui.route('scenarioList')}   handler={ScenarioListView} />
    <Route name="scenarioCreate"    path={ui.route('scenarioCreate')} handler={ScenarioEditView} />
    <Route name="scenarioEdit"      path={ui.route('scenarioEdit')}   handler={ScenarioEditView} />
    <Route name="scenarioView"      path={ui.route('scenarioView')}   handler={ScenarioView}     />
    <Route name="login"             path={ui.route('login')}          handler={Login}            />
    <Route name="local-login"       path={ui.route('local-login')}    handler={LocalLogin}       />
    <Route name="signup"            path={ui.route('signup')}         handler={Signup}           />
    <Route name="profile"           path={ui.route('profile')}        handler={Profile}          />
    <Route name="logout"            path={ui.route('logout')}         handler={Logout}           />
    <Route name="sysinfo"           path={ui.route('sysinfo')}        handler={SysInfo}          />
  </Route>
);

export default routes;
