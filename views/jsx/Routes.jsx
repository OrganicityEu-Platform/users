import React             from 'react';
import Scaffold          from './Scaffold.jsx';
import HomeView          from './HomeView.jsx';
import ScenarioListView  from './scenarios/ScenarioList.jsx';
import ScenarioCreatePt1 from './scenarios/ScenarioCreatePt1.jsx';
import ScenarioCreatePt2 from './scenarios/ScenarioCreatePt2.jsx';
import ScenarioCreatePt3 from './scenarios/ScenarioCreatePt3.jsx';
import ScenarioCreatePt4 from './scenarios/ScenarioCreatePt4.jsx';
import ScenarioCreatePt5 from './scenarios/ScenarioCreatePt5.jsx';
import ScenarioView      from './scenarios/ScenarioView.jsx';
import Login             from './auth/Login.jsx';
import LocalLogin        from './auth/LocalLogin.jsx';
import Signup            from './auth/Signup.jsx';
import Profile           from './auth/Profile.jsx';

var Router = require('react-router')
  , Route = Router.Route;

var routes = (
  <Route handler={Scaffold}>
    <Route name="home"              path="/?"                       handler={HomeView}          />
    <Route name="scenarioList"      path="scenarios/?"              handler={ScenarioListView}  />
    <Route name="scenarioCreatePt1" path="scenarios/new/step-one"   handler={ScenarioCreatePt1} />
    <Route name="scenarioCreatePt2" path="scenarios/new/step-two"   handler={ScenarioCreatePt2} />
    <Route name="scenarioCreatePt3" path="scenarios/new/step-three" handler={ScenarioCreatePt3} />
    <Route name="scenarioCreatePt4" path="scenarios/new/step-four"  handler={ScenarioCreatePt4} />
    <Route name="scenarioCreatePt5" path="scenarios/new/step-five"  handler={ScenarioCreatePt5} />
    <Route name="scenarioView"      path="scenarios/:uuid"          handler={ScenarioView}      />
    <Route name="login"             path="auth/login/?"             handler={Login}             />
    <Route name="local-login"       path="auth/local-login/?"       handler={LocalLogin}        />
    <Route name="signup"            path="auth/signup/?"            handler={Signup}            />
    <Route name="profile"           path="auth/profile/?"           handler={Profile}           />
  </Route>
);

export default routes;
