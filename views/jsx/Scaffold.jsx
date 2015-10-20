import $ from 'jquery';
import React from 'react';
import { Nav, Navbar, NavItem, DropdownButton, MenuItem, CollapsibleNav } from 'react-bootstrap';
import { NavItemLink, ButtonLink, ListGroupItemLink } from 'react-router-bootstrap';
import ReactMixin          from 'react-mixin';
import UserIsLoggedInMixin from './UserIsLoggedInMixin.jsx';
import FooterLarge         from './FooterLarge.jsx';
import FooterSmall         from './FooterSmall.jsx';
import UserHasRoleMixin    from './UserHasRoleMixin.jsx';
import FlashQueue          from './FlashQueue.jsx';
import api                 from '../../api_routes.js';
import ui                  from '../../ui_routes.js';
import CreateScenarioModal from './CreateScenarioModal.jsx';
import SignupModal         from './SignupModal.jsx';
import LoginModal          from './LoginModal.jsx';
import LocalLogin from './auth/LocalLogin.jsx';
import Signup from './auth/Signup.jsx';

var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;

var Scaffold = React.createClass({
  mixins : [UserIsLoggedInMixin, FlashQueue.Mixin, UserHasRoleMixin],
  getInitialState: function() {
    return {
      currentUser : undefined,
      initialAjax : false
    };
  },
  componentDidMount: function() {
    $.ajax(api.reverse('currentUser'), {
      dataType: 'json',
      success : this.onLogin,
      error : (xhr, textStatus, errorThrown) => {
        if (xhr.status === 401) {
          this.onLogout();
        } else {
          this.flashOnAjaxError(
            api.reverse('currentUser'),
            'Error retrieving current user'
          )(xhr, textStatus, errorThrown);
        }
      }
    });
  },
  onLogin: function(currentUser) {
    window.currentUser = currentUser;
    this.state.currentUser = currentUser;
    this.state.initialAjax = true;
    this.setState(this.state);
  },
  onLogout: function() {
    window.currentUser = undefined;
    this.state.initialAjax = true;
    this.state.currentUser = undefined;
    this.setState(this.state);
  },
  render : function() {

    var router;
    if(this.state.initialAjax) {
      router = (<RouteHandler
        onLogin={this.onLogin}
        onLogout={this.onLogout}
        currentUser={this.state.currentUser} />);
    } else {
      console.log("Render initial scaffold");
    }

    var linksLeft = [];
    var linksRight = [];

    linksLeft.push(
      <NavItemLink
        to="scenarioList"
        className="navbar-explore-btn">EXPLORE</NavItemLink>
    );
    linksLeft.push(
      <NavItemLink
        key="scenarioCreate"
        to="scenarioCreate"
        className="navbar-create-btn">CREATE</NavItemLink>
    );
    if (this.userIsLoggedIn()) {
      if (this.userHasRole('admin')) {
        linksRight.push(
          <NavItemLink to="admin_userList">Users</NavItemLink>
        );
        linksRight.push(
          <NavItemLink to="admin_questionnaire">Questionnaire</NavItemLink>
        );
        linksRight.push(
          <NavItemLink to="sysinfo" data-about>About</NavItemLink>
        );
      }
      linksRight.push(
        <NavItemLink key="profile" to="profile">Profile</NavItemLink>
      );
      linksRight.push(
        <NavItemLink
          key="logout"
          to="logout"
          className="nav-logout-btn">Logout</NavItemLink>
      );
    } else {
      linksRight.push(
        <NavItem
          key="login"
          className="nav-login-btn"><LocalLogin/></NavItem>
      );
      linksRight.push(
        <NavItem
          key="signup"
          className="nav-signup-btn"><Signup/></NavItem>
      );
    }
    return (
      <div className="container oc-page-wrapper">
        <div className="row">
          <Navbar brand={<Link to="home"><img src={ui.asset('static/img/oc_logo.png')}/></Link>} toggleNavKey={0}>
            <CollapsibleNav eventKey={0}>
              <Nav navbar>
                {linksLeft}
              </Nav>
              <Nav navbar right>
                {linksRight}
              </Nav>
            </CollapsibleNav>
          </Navbar>
        </div>
        <FlashQueue.Queue messages={this.props.messages}/>
         {router}
        <div className="oc-footers">
          <FooterLarge/>
          <FooterSmall/>
        </div>
      </div>
    );
  }
});

export default Scaffold;
