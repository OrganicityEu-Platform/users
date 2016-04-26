import $                 from 'jquery';
import React             from 'react';
import ReactMixin        from 'react-mixin';
import UserHasRoleMixin  from '../UserHasRoleMixin.jsx';

import LoadingMixin      from '../LoadingMixin.jsx';
import I18nMixin         from '../i18n/I18nMixin.jsx';

import api               from '../../../api_routes.js';
import TagField          from '../form-components/TagField.jsx';
import UserAccountsTable from './UserAccountsTable.jsx';
import UserEditButton    from './UserEditButton.jsx';
import UserDeleteButton  from './UserDeleteButton.jsx';

var Router = require('react-router');
var Link = Router.Link;

import config             from '../../../config/config.js';
import DocumentTitle      from 'react-document-title';

var UserListView = React.createClass({
  mixins: [UserHasRoleMixin, LoadingMixin, I18nMixin],
  getInitialState: function() {
    return {
      users : []
    };
  },
  componentDidMount: function() {
    var url = api.reverse('users');
    this.loading();
    $.ajax(url, {
      dataType: 'json',
      error : this.loadingError(url, 'Error retrieving users'),
      success: (users) => {
        this.loaded({
          users: users
        });
      },
    });
  },
  handleClickedDelete: function(evt) {
    console.log(evt);
  },
  handleUserDeleted: function(deletedUser) {
    // Remove deleted user from the list
    this.setState({
      users: this.state.users.filter((user) => user.uuid !== deletedUser.uuid)
    });
  },
  render: function() {

    if (this.isLoading()) {
      return this.renderLoading();
    }

    var title = config.title + ' | ' + this.i18n('Admin.admin', 'Admin') + ' | ' + this.i18n('Admin.user_list', 'User List');

    return (
      <div className="row">
        <DocumentTitle title={title} />
        <div className="oc-macro-content">
          <h1>{this.i18n('Admin.users', 'Users')}</h1>
          <table className="adminUsersTable">
            <thead>
              <tr>
                <th>{this.i18n('Admin.name', 'Name')}</th>
                <th>{this.i18n('Admin.roles', 'Roles')}</th>
                <th>{this.i18n('Admin.accounts', 'Accounts')}</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                return this.state.users.map((user) => {
                  return (
                    <tr key={user.uuid}>
                      <td>{user.name}</td>
                      <td>{user.roles.join(', ')}</td>
                      <td><UserAccountsTable user={user} /></td>
                      <td><UserEditButton user={user} /></td>
                      <td><UserDeleteButton user={user} onDelete={this.handleUserDeleted} /></td>
                    </tr>
                  );
                });
              })()}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
});

export default UserListView;
