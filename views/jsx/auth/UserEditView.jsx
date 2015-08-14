import $                 from 'jquery';
import React             from 'react';
import ReactMixin        from 'react-mixin';
import UserHasRoleMixin  from '../UserHasRoleMixin.jsx';
import api               from '../../../api_routes.js';
import FlashQueue        from '../FlashQueue.jsx';
import TagField          from '../form-components/TagField.jsx';
import UserAccountsTable from './UserAccountsTable.jsx';

var Router = require('react-router');
var Link = Router.Link;

var UserEditView = React.createClass({
  mixins: [FlashQueue.Mixin, UserHasRoleMixin],
  getInitialState: function() {
    return null;
  },
  componentDidMount: function() {
    var url = api.reverse('user_by_uuid', { uuid : this.props.params.uuid });
    $.ajax(url, {
      dataType: 'json',
      error: this.flashOnAjaxError(url, 'Error retrieving user'),
      success: (user) => {
        this.setState(user);
      }
    });
  },
  handleChangedRoles: function(roles) {
    this.state.dirty = true;
    this.state.roles = roles;
    this.setState(this.state);
  },
  handleRolesSubmit: function(evt) {
    var url = api.reverse('user_by_uuid', { uuid : this.props.params.uuid });
    $.ajax(url, {
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({ roles : this.state.roles }),
      method: 'PATCH',
      error: this.flashOnAjaxError(url, 'Error updating user'),
      success: (user) => {
        this.state.roles = user.roles;
        this.state.dirty = false;
        this.setState(this.state);
      }
    });
  },
  render: function() {
    if (this.state == null) {
      return null;
    }
    return (
      <div>
        <TagField tags={this.state.roles} onChange={this.handleChangedRoles} />
        <input type="submit" onClick={this.handleRolesSubmit} disabled={this.state.dirty ? '' : 'disabled'}/>
      </div>
    );
  }
});

export default UserEditView;
