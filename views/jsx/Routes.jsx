import React                 from 'react';
import Scaffold              from './Scaffold.jsx';
import HomeView              from './HomeView.jsx';
import SysInfo               from './SysInfo.jsx';
import ContactUs             from './ContactUs.jsx';

import ScenarioList          from './scenarios/ScenarioList.jsx';
import ScenarioEditView      from './scenarios/ScenarioEditView.jsx';
import ScenarioView          from './scenarios/ScenarioView.jsx';
import ScenarioEvalView      from './scenarios/ScenarioEvalView.jsx';

import UserView              from './users/UserView.jsx';

import Logout                from './auth/Logout.jsx';
import ForgotPassword        from './auth/ForgotPassword.jsx';
import Login                 from './auth/Login.jsx';
import Signup                from './auth/Signup.jsx';
import Profile               from './auth/Profile.jsx';
import UserListView          from './auth/UserListView.jsx';
import UserEditView          from './auth/UserEditView.jsx';

import QuestionnaireEditView from './admin/QuestionnaireEditView.jsx';

import ui                    from '../../ui_routes.js';

var Router = require('react-router');
var Route = Router.Route;

var routes = (
  <Route handler={Scaffold}>
    <Route name="home"                path={ui.route('home')}                handler={HomeView}              />
    <Route name="scenarioList"        path={ui.route('scenarioList')}        handler={ScenarioList}          />
    <Route name="scenarioCreate"      path={ui.route('scenarioCreate')}      handler={ScenarioEditView}      />
    <Route name="scenarioEdit"        path={ui.route('scenarioEdit')}        handler={ScenarioEditView}      />
    <Route name="scenarioView"        path={ui.route('scenarioView')}        handler={ScenarioView}          />
    <Route name="userView"            path={ui.route('userView')}            handler={UserView}              />
    <Route name="scenarioEvalView"    path={ui.route('scenarioEvalView')}    handler={ScenarioEvalView}      />
    <Route name="login"               path={ui.route('login')}               handler={Login}                 />
    <Route name="signup"              path={ui.route('signup')}              handler={Signup}                />
    <Route name="profile"             path={ui.route('profile')}             handler={Profile}               />
    <Route name="logout"              path={ui.route('logout')}              handler={Logout}                />
    <Route name="sysinfo"             path={ui.route('sysinfo')}             handler={SysInfo}               />
    <Route name="admin_userList"      path={ui.route('admin_userList')}      handler={UserListView}          />
    <Route name="admin_userEdit"      path={ui.route('admin_userEdit')}      handler={UserEditView}          />
    <Route name="admin_questionnaire" path={ui.route('admin_questionnaire')} handler={QuestionnaireEditView} />
    <Route name="forgot-password"     path={ui.route('forgot-password')}     handler={ForgotPassword} />
    <Route name="contactUs"           path={ui.route('contactUs')}           handler={ContactUs} />
  </Route>
);

export default routes;
