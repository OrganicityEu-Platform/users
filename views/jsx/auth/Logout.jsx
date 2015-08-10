import React from 'react';
import $ from 'jquery';
import FlashQueue from '../FlashQueue.jsx';
import api from '../../../api_routes.js';

var Router = require('react-router');
var Navigation = Router.Navigation;
var Link = Router.Link;

var Logout = React.createClass({
  mixins: [FlashQueue.Mixin, Router.Navigation],
  getInitialState : function() {
    return {
      loggedOut : false
    };
  },
  componentDidMount : function() {
    // timeout allows for load animations etc.
    window.setTimeout(() => {
      $.ajax(api.reverse('logout'), {
        error : this.flashOnAjaxError(api.reverse('logout'), 'Error while logging out'),
        success : () => {
          this.setState({ loggedOut : true });
          window.currentUser = undefined;
          // timeout allows to display message
          window.setTimeout(() => {
            this.transitionTo('home');
          }, 1);
        }
      });
    }, 1);
  },
  render : function() {
    if (!this.state.loggedOut) {
      return (
        <div>Logging you out...</div>
      );
    }
    return (
      <div>Logged out!</div>
    );
  }
});

export default Logout;
