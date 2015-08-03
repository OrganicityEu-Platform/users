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
    var userLinks = [];
    if (this.userIsLoggedIn()) {
      userLinks.push(<NavItemLink key="/auth/profile" to="/auth/profile">Profile</NavItemLink>);
      userLinks.push(<NavItemLink key="/auth/logout" to="/auth/logout">Logout</NavItemLink>);
    } else {
      userLinks.push(<NavItemLink key="login" to="login">Login</NavItemLink>);
      userLinks.push(<NavItemLink key="signup" to="signup">Signup</NavItemLink>);
    }
    return (
      <div className="container">
        <Navbar brand={<Link to="/">Home</Link>}>
          <Nav>
            <NavItemLink to="scenarioList">Scenarios</NavItemLink>
            <NavItemLink to="scenarioCreatePt1">Create Scenario</NavItemLink>
            {userLinks}
          </Nav>
        </Navbar>
        <RouteHandler />
      </div>
    );
  }
});

export default Scaffold;
