import React from 'react';
import $ from 'jquery';

var Router = require('react-router')
  , Navigation = Router.Navigation
  , Link = Router.Link;

var Logout = React.createClass({
  mixins: [Router.Navigation],
  getInitialState : function() {
    return {
      loggedOut : false
    };
  },
  componentDidMount : function() {
    window.setTimeout(() => {
      $.ajax('/api/v1/auth/logout', {
        error : console.log,
        success : () => {
          this.setState({ loggedOut : true });
          window.currentUser = undefined;
          window.setTimeout(() => {
            this.transitionTo('home');
          }, 2000);
        }
      });
    }, 1000);
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
