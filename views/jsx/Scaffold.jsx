import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { NavItemLink, ButtonLink, ListGroupItemLink } from 'react-router-bootstrap';

var Router = require('react-router')
  , RouteHandler = Router.RouteHandler
  , Link = Router.Link;

export default class Scaffold extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="container">
        <Navbar brand={<Link to="/">Home</Link>}>
          <Nav>
            <NavItemLink to="scenarioList">Scenarios</NavItemLink>
            <NavItemLink to="/login">Login</NavItemLink>
            <NavItemLink to="/signup">Signup</NavItemLink>
          </Nav>
        </Navbar>
        <RouteHandler />
      </div>
    );
  }
}
