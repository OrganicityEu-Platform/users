import $                 from 'jquery';
import React             from 'react';
import ReactMixin        from 'react-mixin';
import UserHasRoleMixin  from '../UserHasRoleMixin.jsx';
import api               from '../../../api_routes.js';
import TagField          from '../form-components/TagField.jsx';

import LoadingMixin      from '../LoadingMixin.jsx';
import I18nMixin         from '../i18n/I18nMixin.jsx';

var Router = require('react-router');
var Link = Router.Link;

var UserAccountsTable = React.createClass({
  mixins: [UserHasRoleMixin, LoadingMixin, I18nMixin],
  getInitialState: function() {
    return null;
  },
  componentDidMount: function() {
    this.loading();
    var url = api.reverse('user_by_uuid', { uuid : this.props.user.uuid });
    $.ajax(url, {
      dataType: 'json',
      error: this.loadingError(url, 'Error retrieving user'),
      success: (user) => {
        this.loaded(user);
      },
    });
  },
  accountFields : {
    'local'    : ['email'],
    'twitter'  : ['displayName', 'username'],
    'google'   : ['email', 'name'],
    'facebook' : ['displayName'],
    'local'    : ['email'],
    'github'   : ['displayName', 'username']
  },
  renderAccount: function(account) {
    return (
      <div key={this.state.uuid + '_' + account}>
        <h4>{account}</h4>
        {this.accountFields[account].map((field) => {
          return (
            <div key={this.state.uuid + '_' + account + '_' + field}>
              <b>{ this.i18n('Admin.'+field, field) }: </b> {this.state[account][field]}<br/>
            </div>
          );
        })}
      </div>
    );
  },
  render: function() {
    if (this.isLoading() || this.state == null) {
      return this.renderLoading();
    }
    var accounts = [];
    for (var account in this.accountFields) {
      if(account === 'local' && this.state[account] && this.state[account].email) {
        accounts.push(this.renderAccount(account));
      } else if (this.state[account] && this.state[account].id) {
        accounts.push(this.renderAccount(account));
      }
    }
    return (
      <div>
        {accounts}
      </div>
    );
  }
});

export default UserAccountsTable;
