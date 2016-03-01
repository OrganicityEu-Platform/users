import $            from 'jquery';
import React        from 'react';
import Router       from 'react-router';

import api          from '../../../api_routes.js';

import LoadingMixin from '../LoadingMixin.jsx';

var Navigation = Router.Navigation;
var Link = Router.Link;

import config             from '../../../config/config.js';
import DocumentTitle      from 'react-document-title';


var Logout = React.createClass({
  mixins: [Router.Navigation, LoadingMixin],
  getInitialState : function() {
    return {};
  },
  componentDidMount : function() {
    var url = api.reverse('logout');
    this.loading();
    $.ajax(url, {
      error: this.loadingError(url, 'Logout failed'),
      success : () => {
        this.props.onLogout(); // Scaffold.onLogout
        this.loadingSuccess('Logout successful!');
        this.transitionTo('home');
      }
    });
  },
  render : function() {
    return (
      <div>
        <DocumentTitle title={config.title + ' | Logout'} />
        <div>Logging you out...</div>
      </div>
    );
  }
});

export default Logout;
