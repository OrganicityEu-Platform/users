import $ from 'jquery';
import React from 'react';
import { Nav, Navbar, NavItem, DropdownButton, NavDropdown, MenuItem, CollapsibleNav } from 'react-bootstrap';
import { NavItemLink, ButtonLink, ListGroupItemLink } from 'react-router-bootstrap';
import ReactMixin          from 'react-mixin';
import UserIsLoggedInMixin from './UserIsLoggedInMixin.jsx';
import FooterLarge         from './FooterLarge.jsx';
import FooterSmall         from './FooterSmall.jsx';
import UserHasRoleMixin    from './UserHasRoleMixin.jsx';
import FlashQueue          from './FlashQueue.jsx';
import api                 from '../../api_routes.js';
import ui                  from '../../ui_routes.js';

import Signup              from './auth/Signup.jsx';
import CookiePrompt        from './CookiePrompt.jsx';
import LanguageSwitcher    from './i18n/LanguageSwitcher.jsx';
import I18nMixin           from './i18n/I18nMixin.jsx';

var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;

var Scaffold = React.createClass({
  mixins : [UserIsLoggedInMixin, Router.State, UserHasRoleMixin, I18nMixin],
  getInitialState: function() {
    return {
      currentUser : undefined,
      initialAjax : false,
      userEvaluations: null,
    };
  },
  componentDidMount: function() {
    var url = api.reverse('currentUser');
    $.ajax(url, {
      dataType: 'json',
      success : this.onLogin,
      error : (xhr, textStatus, errorThrown) => {
        if (xhr.status === 401) {
          this.onLogout();
        } else {
          this.flashOnAjaxError(url, 'Error retrieving current user')(xhr, textStatus, errorThrown);
        }
      }
    });
  },
  getUserEvaluations: function() {
    var url = api.reverse('feedback_by_user', { uuid : currentUser.uuid });
    $.ajax(url, {
      dataType: 'json',
      success : this.setEvaluations,
      error : (xhr, textStatus, errorThrown) => {
        if (xhr.status === 401) {
          this.onLogout();
        } else {
          this.flashOnAjaxError(url, 'Error retrieving evaluated scenarios for current user')(xhr, textStatus, errorThrown);
        }
      }
    });
  },
  setEvaluations: function(evaluations) {
    window.userEvaluations = evaluations;
    this.setState({
      userEvaluations: evaluations
    });
  },
  onLogin: function(currentUser) {
    window.currentUser = currentUser;
    this.getUserEvaluations();
    this.setState({
      currentUser: currentUser,
      initialAjax: true
    });
  },
  onLogout: function() {
    window.currentUser = undefined;
    window.userEvaluations = null;
    this.userEvaluations = null;
    this.setState({
      currentUser: undefined,
      userEvaluations: null,
      initialAjax: true

    });
  },
  handleClass: function() {
    // use this to change to change/animate background image on route change
    var currentRoute = this.getRoutes()[this.getRoutes().length - 1].name;
    if (currentRoute != 'home') {
      return (
        'oc-page-wrapper container'
      );
    }else {
      return (
        'oc-page-wrapper container'
      );
    }
  },
  routeName: function() {
    return this.getRoutes()[this.getRoutes().length - 1].name;
  },
  setSource: function() {
    var src = {
      route: this.routeName(),
      params: this.getParams()
    };
    sessionStorage.setItem('srcPath', JSON.stringify(src));
  },
  clickedLogin: function() {
    this.setSource();
  },
  clickedSignup: function() {
    this.setSource();
  },
  clickedCreate: function() {
    if(!this.userIsLoggedIn()) {
      sessionStorage.setItem('srcPath', JSON.stringify({
        route: 'scenarioCreate'
      }));
    }
  },
  render : function() {

    var router;

    if (this.state.initialAjax) {
      router = (
        <RouteHandler
          onLogin={this.onLogin}
          onLogout={this.onLogout}
          currentUser={this.state.currentUser} />
      );
    } else {
      //console.log('Render initial scaffold');
    }

    var linksLeft = [];
    var linksRight = [];
    var adminLinks = [];
/*
    linksLeft.push(
      <NavItemLink
        key="scenarioList"
        to="scenarioList"
        className="navbar-button all-uppercase"
        id="navbar-explore-btn">
        {this.i18n('explore', 'EXPLORE')}
      </NavItemLink>
    );
    linksLeft.push(
      <NavItemLink
        key="scenarioCreate"
        to="scenarioCreate"
        onClick={this.clickedCreate}
        className="navbar-button all-uppercase"
        id="navbar-create-btn">
        {this.i18n('create', 'CREATE')}
      </NavItemLink>
    );
*/
    if (this.userIsLoggedIn()) {
/*
      if (this.userHasRole('admin')) {
        adminLinks.push(
          <NavItemLink
            key="users"
            className="dropdown-items"
            to="admin_userList">
            {this.i18n('users', 'Users')}
          </NavItemLink>
        );
      }
*/

/*
      linksRight.push(
        <NavItemLink
          key="coCreation"
          className="nav-profile-btn"
          to="profile">
          {this.i18n('coCreation', 'Co-Creation')}
        </NavItemLink>
      );
      linksRight.push(
        <NavItemLink
          key="federatedIdentity"
          className="nav-profile-btn"
          to="profile">
          {this.i18n('federatedIdentity', 'Federated Identities')}
        </NavItemLink>
      );
      linksRight.push(
        <NavItemLink
          key="authenticator"
          className="nav-profile-btn"
          to="profile">
          {this.i18n('authenticator', 'Authenticator')}
        </NavItemLink>
      );
      linksRight.push(
        <NavItemLink
          key="password"
          className="nav-profile-btn"
          to="profile">
          {this.i18n('password2', 'Password')}
        </NavItemLink>
      );
*/
      linksRight.push(
        <NavItemLink
          key="profile"
          className="nav-profile-btn"
          to="profile">
          {this.i18n('profile', 'profile')}
        </NavItemLink>
      );
      linksRight.push(
        <NavItemLink
          key="change_password"
          className="nav-profile-btn"
          to="change_password">
          {this.i18n('change_password', 'Change password')}
        </NavItemLink>
      );
      linksRight.push(
        <NavItemLink
          key="logout"
          to="logout"
          className="nav-logout-btn">
          {this.i18n('log_out', 'log out')}
        </NavItemLink>
      );
    } else {
      /*
      linksRight.push(
      <NavItemLink
      key="signup"
      to="signup"
      onClick={this.clickedSignup}
      className="nav-signup-btn">sign up</NavItemLink>
    );
    */
    linksRight.push(
      <NavItemLink
        key="login"
        to="login"
        onClick={this.clickedLogin}
        className="nav-login-btn">
        {this.i18n('log_in', 'log in')}
      </NavItemLink>
    );
  }

  linksRight.push(
    <LanguageSwitcher />
  );

  return (
    <div className={this.handleClass()}>
      <div className="oc-navbar-wrapper">
        <div className="oc-macro-content">
          <Navbar
            brand={
              <Link to="home">
                <img src={ui.asset('static/img/oc-nav-header.png')}/>
              </Link>
            }
            toggleNavKey={0}>
            <CollapsibleNav eventKey={0}>
              <span className="oc-left-links-wrapper">
                <Nav navbar>
                  {linksLeft}
                </Nav>
              </span>
              <Nav navbar right>
                {linksRight.reverse()}
              </Nav>
            </CollapsibleNav>
          </Navbar>
        </div>
      </div>
      <div className="oc-inner-page-wrapper">
        <FlashQueue.Queue messages={this.props.messages}/>
        {router}
        <CookiePrompt />
      </div>

      <div className="oc-footers">
        <FooterLarge currentUser={this.state.currentUser}/>
      </div>
    </div>
  );
}
});

export default Scaffold;
