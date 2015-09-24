import $ from 'jquery';
import React from 'react';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import { NavItemLink, ButtonLink, ListGroupItemLink } from 'react-router-bootstrap';
import ReactMixin from 'react-mixin';
import UserIsLoggedInMixin from './UserIsLoggedInMixin.jsx';
import FooterLarge from './FooterLarge.jsx';
import FooterSmall from './FooterSmall.jsx';
import UserHasRoleMixin from './UserHasRoleMixin.jsx';
import FlashQueue from './FlashQueue.jsx';
import api from '../../api_routes.js';

var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;

var Scaffold = React.createClass({
  mixins : [UserIsLoggedInMixin, FlashQueue.Mixin, UserHasRoleMixin],
  getInitialState: function() {
    return {
      currentUser : undefined
    };
  },
  componentDidMount: function() {

    var self = this;
    $.ajax(api.reverse('currentUser'), {
      accepts : 'application/json',
      success : self.onLogin,
      error : function(jqXHR, textStatus, errorThrown) {
        if (jqXHR.status === 422 || jqXHR.status === 403) {
          self.onLogout();
        } else {
          self.flashOnAjaxError(
            api.reverse('currentUser'),
            'Error retrieving current user'
          )(jqXHR, textStatus, errorThrown);
        }
      }
    });
  },
  onLogin: function(currentUser) {
    window.currentUser = currentUser;
    this.state.currentUser = currentUser;
    this.setState(this.state);
  },
  onLogout: function() {
    window.currentUser = undefined;
    this.state.currentUser = undefined;
    this.setState(this.state);
  },
  render : function() {
    var linksLeft = [];
    var linksRight = [];

    linksLeft.push(<NavItemLink to="scenarioList">EXPLORE</NavItemLink>);
    if (this.userIsLoggedIn()) {
      linksLeft.push(<NavItemLink key="scenarioCreate" to="scenarioCreate" className="navbar-create-btn">CREATE</NavItemLink>);
      if (this.userHasRole('admin')) {
        linksRight.push(<NavItemLink to="admin_userList">Users</NavItemLink>);
      }
      linksRight.push(<NavItemLink key="profile" to="profile">Profile</NavItemLink>);
      linksRight.push(<NavItemLink key="logout" to="logout" className="nav-logout-btn">Logout</NavItemLink>);
    } else {
      linksRight.push(<NavItemLink key="login" to="login" className="nav-login-btn">Login</NavItemLink>);
      linksRight.push(<NavItemLink key="signup" to="signup" className="nav-signup-btn">Signup</NavItemLink>);
    }
    linksRight.push(<NavItemLink to="sysinfo" data-about>About</NavItemLink>);

    return (
      <div className="container oc-page-wrapper">
        <Navbar brand={<Link to="home"><img src="http://organicity.eu/wp-content/themes/organicity/images/organicity_logo.png"/></Link>}>
          <Nav navbar>
            {linksLeft}
          </Nav>
          <Nav navbar right>
            {linksRight}
          </Nav>
        </Navbar>
        <FlashQueue.Queue messages={this.props.messages}/>
        <RouteHandler onLogin={this.onLogin} onLogout={this.onLogout} currentUser={this.state.currentUser} />
        <div className="oc-footers">
          <FooterLarge/>
          <FooterSmall/>
        </div>
      </div>
    );
  }
});

export default Scaffold;
