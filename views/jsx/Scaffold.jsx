import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { NavItemLink, ButtonLink, ListGroupItemLink } from 'react-router-bootstrap';
var mixins = require('react-mixin');
import UserIsLoggedInMixin from './UserIsLoggedInMixin.jsx';

var Router = require('react-router')
  , RouteHandler = Router.RouteHandler
  , Link = Router.Link;

export default class Scaffold extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    var userLinks = [];
    if (this.userIsLoggedIn()) {
      userLinks.push(<NavItemLink to="/auth/profile">Profile</NavItemLink>);
      userLinks.push(<NavItemLink to="/auth/logout">Logout</NavItemLink>);
    } else {
      userLinks.push(<NavItemLink to="/auth/login">Login</NavItemLink>);
      userLinks.push(<NavItemLink to="/auth/signup">Signup</NavItemLink>);
    }
    return (
      <div className="container">
        <Navbar brand={<Link to="/">Home</Link>}>
          <Nav>
            <NavItemLink to="scenarioList">Scenarios</NavItemLink>
            {userLinks}
          </Nav>
        </Navbar>
        <RouteHandler />
      </div>
    );
  }
}

mixins(Scaffold.prototype, UserIsLoggedInMixin);
