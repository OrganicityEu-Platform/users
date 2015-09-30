import $ from 'jquery';
import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { NavItemLink, ButtonLink, ListGroupItemLink } from 'react-router-bootstrap';
import FlashQueue from './FlashQueue.jsx';
import LoadingMixin from './LoadingMixin.jsx';
import LoginModal from './LoginModal.jsx';
import CreateScenarioModal from './CreateScenarioModal.jsx';
import EvaluateScenarioModal from './EvaluateScenarioModal.jsx';
import api from '../../api_routes.js';

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
          <h1>Lorem!</h1>
          <p>
            Donec ullamcorper nulla non metus auctor fringilla. Cras justo odio, dapibus ac
            facilisis in, egestas eget quam. Etiam porta sem malesuada magna mollis euismod. Donec
            ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod
            semper. Nulla vitae elit libero, a pharetra augue. Aenean lacinia bibendum nulla sed
            consectetur.
          </p>
          <p>
            Vestibulum id ligula porta felis euismod semper. Donec ullamcorper nulla non metus auctor
            fringilla. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sagittis
            lacus vel augue laoreet rutrum faucibus dolor auctor. Donec sed odio dui. Donec id elit
            non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id
            elit.
          </p>
          <p>
            Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies
            vehicula ut id elit. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis
            vestibulum. Nullam id dolor id nibh ultricies vehicula ut id elit. Aenean eu leo quam.
            Pellentesque ornare sem lacinia quam venenatis vestibulum. Duis mollis, est non commodo
            luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Morbi leo risus,
            porta ac consectetur ac, vestibulum at eros.
          </p>
          <p>
            Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Maecenas
            faucibus mollis interdum. Maecenas sed diam eget risus varius blandit sit amet non
            magna. Nullam id dolor id nibh ultricies vehicula ut id elit. Lorem ipsum dolor sit
            amet, consectetur adipiscing elit. Nulla vitae elit libero, a pharetra augue. Maecenas
            sed diam eget risus varius blandit sit amet non magna.
          </p>
          <p>
            <button className="btn btn-primary" onClick={this.onClickNotification}>Notification</button>
            <button className="btn btn-error"
              disabled={this.isLoading() ? 'disabled' : ''}
              onClick={this.onClickAjaxError}>Create AJAX error</button>
          </p>
          <i class="fa fa-camera-retro fa-lg"></i>
          <LoginModal/>
          <CreateScenarioModal/>
          <EvaluateScenarioModal/>
        </div>
    );
  }
});

export default HomeView;
