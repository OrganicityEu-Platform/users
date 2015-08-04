import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { NavItemLink, ButtonLink, ListGroupItemLink } from 'react-router-bootstrap';
import ReactMixin from 'react-mixin';
import UserIsLoggedInMixin from './UserIsLoggedInMixin.jsx';

var Router = require('react-router')
  , RouteHandler = Router.RouteHandler
  , Link = Router.Link;

var Scaffold = React.createClass({
  mixins : [UserIsLoggedInMixin],
  render : function() {
    var loggedInLinks = [];
    var userLinks = [];
    if (this.userIsLoggedIn()) {
      loggedInLinks.push(<NavItemLink key="scenarioCreatePt1" to="scenarioCreatePt1">Create Scenario</NavItemLink>)
      userLinks.push(<NavItemLink key="profile" to="profile">Profile</NavItemLink>);
      userLinks.push(<NavItemLink key="logout" to="logout">Logout</NavItemLink>);
    } else {
      userLinks.push(<NavItemLink key="login" to="login">Login</NavItemLink>);
      userLinks.push(<NavItemLink key="signup" to="signup">Signup</NavItemLink>);
    }
    return (
      <div className="container">
        <Navbar brand={<Link to="/">Home</Link>}>
          <Nav navbar>
            <NavItemLink to="scenarioList">Scenarios</NavItemLink>
            {loggedInLinks}
          </Nav>
          <Nav navbar>
            {userLinks}
          </Nav>
        </Navbar>
        <RouteHandler />
      </div>
    );
  }
});

export default Scaffold;
