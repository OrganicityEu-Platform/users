import $            from 'jquery';
import React        from 'react';
import Router       from 'react-router';

import api          from '../../../api_routes.js';

import LoadingMixin from '../LoadingMixin.jsx';

var Navigation = Router.Navigation;
var Link = Router.Link;

var Logout = React.createClass({
  mixins: [Router.Navigation, LoadingMixin],
  getInitialState : function() {
    return {};
  },
  componentDidMount : function() {
    var url = api.reverse('logout');
    this.loading();
    $.ajax(url, {
      error: this.loadingError(url, 'Logout error'),
      success : () => {
        this.props.onLogout(); // Scaffold.onLogout
        this.loadingSuccess('Logout successful!');
        this.transitionTo('home');
      }
    });
  },
  render : function() {
    return (
      <div>Logging you out...</div>
    );
  }
});

export default Logout;
