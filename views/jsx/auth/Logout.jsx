import $            from 'jquery';
import React        from 'react';
import Router       from 'react-router';

import api          from '../../../api_routes.js';
import ui          from '../../../ui_routes.js';

import LoadingMixin from '../LoadingMixin.jsx';
import I18nMixin    from '../i18n/I18nMixin.jsx';
import UserIsLoggedInMixin  from './../UserIsLoggedInMixin.jsx';

var Navigation = Router.Navigation;
var Link = Router.Link;

import config             from '../../../config/config.js';
import DocumentTitle      from 'react-document-title';

var Logout = React.createClass({
  mixins: [Router.Navigation, LoadingMixin, I18nMixin, UserIsLoggedInMixin],
  getInitialState : function() {
    return {};
  },
  componentDidMount : function() {
    if (this.userIsLoggedIn()) {
      var failMsg = this.i18n('logout_fail', 'Logout failed');
      var successMsg = this.i18n('logout_successful', 'Logout successful!');
      var url = api.reverse('logout');
      this.loading();
      $.ajax(url, {
        error: this.loadingError(url, failMsg),
        success : () => {
          //this.props.onLogout();
          var url = encodeURI(config.host + ':' + config.port + ui.reverse('logout'));
          if(config.host_external && config.port_external) {
            url = encodeURI(config.host_external + ':' + config.port_external + ui.reverse('logout'));
          }
          console.log(url);
          location.href = 'https://accounts.organicity.eu/realms/organicity/protocol/openid-connect/logout?redirect_uri=' + url;
        }
      });
    }
  },
  render : function() {
    if (this.userIsLoggedIn()) {
      return (
        <div>
          <DocumentTitle title={config.title + ' | ' + this.i18n('logout', 'Logout')} />
          <div>{this.i18n('logging_you_out', 'Logging you out...')}</div>
        </div>
      );
    } else {
      return (
        <div>
          <h1 className="oc-pink">Logout successful.</h1>
        </div>
      );
    }
  }
});

export default Logout;
