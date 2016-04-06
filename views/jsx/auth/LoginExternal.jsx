import $        from 'jquery';
import React    from 'react';

import LoadingMixin      from '../LoadingMixin.jsx';

import api      from '../../../api_routes.js';

var Login = React.createClass({
  mixins: [LoadingMixin],
  getInitialState : function() {
    window.location = api.reverse('auth_oauth2');
    return {};
  },
  componentDidMount : function() {
    this.loading();
  },
  render : function() {
    return this.renderLoading();
  }
});

export default Login;
