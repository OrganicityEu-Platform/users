import $                 from 'jquery';
import React             from 'react';
import ReactMixin        from 'react-mixin';
import UserHasRoleMixin  from '../UserHasRoleMixin.jsx';
import api               from '../../../api_routes.js';
import FlashQueue        from '../FlashQueue.jsx';
import TagField          from '../form-components/TagField.jsx';

var Router = require('react-router');
var Link = Router.Link;

var UserAccountsTable = React.createClass({
  mixins: [FlashQueue.Mixin, UserHasRoleMixin],
  getInitialState: function() {
    return null;
  },
  componentDidMount: function() {
    var url = api.reverse('user_by_uuid', { uuid : this.props.user.uuid });
    $.ajax(url, {
      dataType: 'json',
      error: this.flashOnAjaxError(url, 'Error retrieving user'),
      success: (user) => {
        this.setState(user);
      },
    });
  },
  accountFields : {
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
            <div key={account}>
              <b>{ field }:</b> {this.state[account][field]}<br/>
            </div>
          );
        })}
      </div>
    );
  },
  render: function() {
    if (this.state == null) {
      return null;
    }
    var accounts = [];
    for (var account in this.accountFields) {
      if (this.state[account]) {
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
