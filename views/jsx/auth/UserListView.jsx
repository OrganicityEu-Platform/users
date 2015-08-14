import $                 from 'jquery';
import React             from 'react';
import ReactMixin        from 'react-mixin';
import UserHasRoleMixin  from '../UserHasRoleMixin.jsx';
import api               from '../../../api_routes.js';
import FlashQueue        from '../FlashQueue.jsx';
import TagField          from '../form-components/TagField.jsx';
import UserAccountsTable from './UserAccountsTable.jsx';
import UserEditButton    from './UserEditButton.jsx';
import UserDeleteButton  from './UserDeleteButton.jsx';

var Router = require('react-router');
var Link = Router.Link;

var UserListView = React.createClass({
  mixins: [FlashQueue.Mixin, UserHasRoleMixin],
  getInitialState: function() {
    return {
      loading: true,
      users : null
    };
  },
  componentDidMount: function() {
    $.ajax(api.reverse('users'), {
      dataType: 'json',
      error : (jqXHR, textStatus, errorThrown) => {
        this.state.loading = false;
        this.setState(this.state);
        var f = this.flashOnAjaxError(api.reverse('users'), 'Error retrieving users');
        f(jqXHR, textStatus, errorThrown);
      },
      success: (users) => {
        this.state.loading = false;
        this.state.users = users;
        this.setState(this.state);
      },
    });
  },
  handleClickedDelete: function(evt) {
    console.log(evt);
  },
  handleUserDeleted: function(deletedUser) {
    this.flash(
      'success',
      `User account of "${deletedUser.name}" (UUID: "${deletedUser.uuid}") was successful`
    );
    this.state.users = this.state.users.filter((user) => user.uuid !== deletedUser.uuid);
    this.setState(this.state);
  },
  render: function() {
    return (
      <div className="row">
        <h1>Users</h1>
        <table className="adminUsersTable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Roles</th>
              <th>Accounts</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              if (this.state.users === null) {
                return (
                  <tr>
                    <td colSpan="5">Loading...</td>
                  </tr>
                );
              }
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
    );
  }
});

export default UserListView;
