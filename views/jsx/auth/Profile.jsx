import $                from 'jquery';
import React            from 'react';
import ReactMixin       from 'react-mixin';
import UserHasRoleMixin from '../UserHasRoleMixin.jsx';
import api              from '../../../api_routes.js';
import FlashQueue       from '../FlashQueue.jsx';
import LoadingMixin     from '../LoadingMixin.jsx';
import TagField         from '../form-components/TagField.jsx';

var Router = require('react-router');
var Link = Router.Link;

var Profile = React.createClass({
  mixins: [FlashQueue.Mixin, UserHasRoleMixin, LoadingMixin],
  getInitialState: function() {
    var state = {
      dirty   : false,
      profile : {
        name    : '',
        gender  : 'f',
        roles   : []
      }
    };
    return state;
  },
  componentDidMount: function() {
    this.loading();
    var url = api.reverse('currentUser');
    $.ajax(url, {
      dataType: 'json',
      error: this.loadingError(url, 'Error retrieving current user'),
      success : (profile) => {
        this.loaded({ dirty : false, profile : profile});
      }
    });
  },
  handleChangedName: function(evt) {
    this.state.dirty = true;
    this.state.profile.name = evt.target.value;
    this.setState(this.state);
  },
  handleChangedGender: function(evt) {
    this.state.dirty = true;
    this.state.profile.gender = evt.target.value;
    this.setState(this.state);
  },
  handleChangedRoles: function(roles) {
    this.state.dirty = true;
    this.state.profile.roles = roles;
    this.setState(this.state);
  },
  handleSubmit: function(evt) {
    evt.preventDefault();
    var profile = this.state.profile;
    // patch would be forbidden if we try to change roles and we're not admin...
    if (!this.userHasRole('admin')) {
      profile.roles = undefined;
    }
    this.loading();
    var url = api.reverse('user_by_uuid', { uuid : this.state.profile.uuid});
    $.ajax(url, {
      type : 'PATCH',
      data : JSON.stringify(profile),
      contentType : 'application/json',
      error : this.loadingError(url, 'Error updating user profile'),
      success : () => {
        this.loaded({ dirty : false });
        this.flash('success', 'Succesfully updated your profile');
      }
    });
  },
  render: function() {
    return (
      <div className="row well">
        <form className="form-horizontal">
          <div className="form-group">
            <label className="control-label col-sm-2" htmlFor="profile-name">Name</label>
            <div className="col-sm-10">
              <input  type="text"
                      className="form-control"
                      id="profile-name"
                      disabled={this.isLoading() ? 'disabled' : ''}
                      placeholder={this.isLoading() ? 'Loading...' : 'Name...'}
                      value={this.state.profile.name}
                      onChange={this.handleChangedName} />
            </div>
          </div>
          <div className="form-group">
            <label className="control-label col-sm-2" htmlFor="profile-gender">Gender</label>
            <div className="col-sm-10">
              <input type="radio"
                name="gender"
                id="profile-gender-f"
                value="f"
                disabled={this.isLoading() ? 'disabled' : ''}
                checked={this.state.profile.gender === 'f'}
                onChange={this.handleChangedGender} /> Female<br/>
              <input type="radio"
                name="gender"
                id="profile-gender-m"
                value="m"
                disabled={this.isLoading() ? 'disabled' : ''}
                checked={this.state.profile.gender === 'm'}
                onChange={this.handleChangedGender} /> Male
            </div>
          </div>
          {(() => {
            if (this.userHasRole('admin')) {
              return (
                <div className="form-group">
                  <label className="control-label col-sm-2" htmlFor="profile-roles">Roles</label>
                  <div className="col-sm-10">
                    <TagField
                      key={this.state.profile.uuid + '_roles'}
                      tags={this.state.profile.roles}
                      loading={this.isLoading()}
                      onChange={this.handleChangedRoles} />
                  </div>
                </div>
              );
            }
          })()}
          <div className="form-group">
            <div className="col-sm-2"></div>
            <div className="col-sm-10">
              <button id="profile-submit"
                      type="submit"
                      disabled={this.state.dirty ? '' : 'disabled'}
                      className="btn btn-default"
                      onClick={this.handleSubmit}>Save Profile</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
});

export default Profile;
