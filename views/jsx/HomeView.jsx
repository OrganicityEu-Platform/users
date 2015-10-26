import $ from 'jquery';
import React from 'react';
import { Nav, Navbar, Accordion, Panel } from 'react-bootstrap';
import { NavItemLink, ButtonLink, ListGroupItemLink } from 'react-router-bootstrap';
import FlashQueue from './FlashQueue.jsx';
import LoadingMixin from './LoadingMixin.jsx';
import LoginModal from './LoginModal.jsx';
import SignupModal from './SignupModal.jsx';
import HomeViewHeader from './HomeViewHeader.jsx';
import HomeViewSection from './HomeViewSection.jsx';
import HomeViewFooter from './HomeViewFooter.jsx';
import CreateScenarioModal from './CreateScenarioModal.jsx';
import EvaluateScenarioModal from './EvaluateScenarioModal.jsx';
import EditScenarioModal from './EditScenarioModal.jsx';
import api from '../../api_routes.js';
import Tags from './Tags.jsx';

import SectorSelector from './SectorSelector.jsx';

var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;

var HomeView = React.createClass({
  mixins : [FlashQueue.Mixin, LoadingMixin],
  onClickNotification : function() {
    this.flash('info', 'A friendly notice');
  },
  onClickAjaxError : function() {
    this.loading();
    $.ajax(api.reverse('error'), {
      error : this.loadingError(api.reverse('error'), 'Error while demonstrating error handling'),
      success: (data) => {
        this.loaded();
        alert('Non-existing resource exists... WTF?');
      }
    });
  },
  render : function() {
    return (
        <div className="row">
          <HomeViewHeader />
          <HomeViewSection />
          <HomeViewFooter />
        </div>
    );
  }
});

export default HomeView;
