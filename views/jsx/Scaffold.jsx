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
    var currentRoute = this.getRoutes()[this.getRoutes().length - 1].name;
    if (currentRoute != 'home') {
      return (
        'container oc-page-wrapper' // set no/new hero here if needed or reposition/animate hero (append className="animate-area")
      );
    }else {
      return (
        'container oc-page-wrapper'
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

    linksLeft.push(
      <NavItemLink
        key="scenarioList"
        to="scenarioList"
        className="navbar-button"
        id="navbar-explore-btn">{this.i18n('explore', 'EXPLORE')}</NavItemLink>
    );
    linksLeft.push(
      <NavItemLink
        key="scenarioCreate"
        to="scenarioCreate"
        onClick={this.clickedCreate}
        className="navbar-button"
        id="navbar-create-btn">{this.i18n('create', 'CREATE')}</NavItemLink>
    );

    if (this.userIsLoggedIn()) {
      if (this.userHasRole('admin')) {
        adminLinks.push(
          <NavItemLink
            key="users"
            className="dropdown-items"
            to="admin_userList">{this.i18n('users', 'Users')}</NavItemLink>
        );
        adminLinks.push(
          <NavItemLink
            key="questionnaire"
            className="dropdown-items"
            to="admin_questionnaire">{this.i18n('questionnaire', 'Questionnaire')}</NavItemLink>
        );
        adminLinks.push(
          <NavItemLink
            key="sysinfo"
            className="dropdown-items"
            to="sysinfo"
            data-about>{this.i18n('about', 'About')}</NavItemLink>
        );
        adminLinks.push(
          <NavItemLink
            key="reportList"
            to="reportList"
            className="dropdown-items"
            id="">{this.i18n('reports', 'Reports')}</NavItemLink>
        );
        linksRight.push(
          <DropdownButton
            className="oc-admin-links"
            title="admin">
            {adminLinks}
          </DropdownButton>
        );
      }
      linksRight.push(
        <NavItemLink
          key="profile"
          className="nav-profile-btn"
          to="profile">{this.i18n('profile', 'profile')}</NavItemLink>
      );
      linksRight.push(
        <NavItemLink
          key="logout"
          to="logout"
          className="nav-logout-btn">{this.i18n('log_out', 'log out')}</NavItemLink>
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
      <li className="nav-lang-btn"><LanguageSwitcher /></li>
    );

    return (
      <div className={this.handleClass()}>
        <div className="row oc-navbar-wrapper">
          <div className="col-lg-8 col-lg-offset-2">
            <Navbar
              brand={<Link to="home"><img src={ui.asset('static/img/oc-nav-header.png')}/></Link>}
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
