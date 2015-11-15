import $            from 'jquery';
import React        from 'react';
import Router       from 'react-router';

import config       from '../../../config/config.js';

import FlashQueue   from '../FlashQueue.jsx';
import api          from '../../../api_routes.js';

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
    var url = api.reverse('logout');
    $.ajax(url, {
      error: (xhr, textStatus, errorThrown) => {
        if (!config.dev) {
          this.flash('danger', 'Error during logout');
        } else {
          this.flashOnAjaxError(url, 'Error during logout')(xhr, textStatus, errorThrown);
        }
      },
      success : () => {
        this.setState({ loggedOut : true });
        this.props.onLogout(); // Scaffold.onLogout

        this.flash('success', 'Logout successful!');
        this.transitionTo('home');
      }
    });
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
