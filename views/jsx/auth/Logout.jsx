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
    // timeout allows for load animations etc.
    window.setTimeout(() => {
      $.ajax('/api/v1/auth/logout', {
        error : console.log,
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
