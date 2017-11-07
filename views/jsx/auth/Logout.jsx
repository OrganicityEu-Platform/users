import $            from 'jquery';
import React        from 'react';
import Router       from 'react-router';

import api          from '../../../api_routes.js';

import LoadingMixin from '../LoadingMixin.jsx';
import I18nMixin    from '../i18n/I18nMixin.jsx';

var Navigation = Router.Navigation;
var Link = Router.Link;

import config             from '../../../config/config.js';
import DocumentTitle      from 'react-document-title';

var Logout = React.createClass({
  mixins: [Router.Navigation, LoadingMixin, I18nMixin],
  getInitialState : function() {
    return {};
  },
  componentDidMount : function() {
    var failMsg = this.i18n('logout_fail', 'Logout failed');
    var successMsg = this.i18n('logout_successful', 'Logout successful!');
    var url = api.reverse('logout');
    this.loading();
    $.ajax(url, {
      error: this.loadingError(url, failMsg),
      success : () => {
        this.props.onLogout();
        var url = encodeURI(config.host + ":" + config.port + config.contextPath);
        if(config.host_external && config.port_external) {
          url = encodeURI(config.host_external + ":" + config.port_external + config.contextPath);
        }
        console.log(url);
        location.href = "https://accounts.organicity.eu/realms/organicity/protocol/openid-connect/logout?redirect_uri=" + url;
      }
    });
  },
  render : function() {
    return (
      <div>
        <DocumentTitle title={config.title + ' | ' + this.i18n('logout', 'Logout')} />
        <div>{this.i18n('logging_you_out', 'Logging you out...')}</div>
      </div>
    );
  }
});

export default Logout;
