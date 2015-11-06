import $                from 'jquery';
import React            from 'react';
import ReactMixin       from 'react-mixin';
import UserHasRoleMixin from '../UserHasRoleMixin.jsx';
import api              from '../../../api_routes.js';
import FlashQueue       from '../FlashQueue.jsx';
import LoadingMixin     from '../LoadingMixin.jsx';
import TagField         from '../form-components/TagField.jsx';
import UploadImage      from '../UploadImage.jsx';

import UserIsLoggedInMixin from '../UserIsLoggedInMixin.jsx';

var Router = require('react-router');
var Link = Router.Link;

// Input validation
import validation       from 'react-validation-mixin';
import strategy         from 'joi-validation-strategy';
import UserJoi          from '../../../models/joi/user.js';
import Message          from '../Message.jsx';

import ScenariosNewest  from '../scenarios/ScenariosNewest.jsx';

var Profile = React.createClass({
  mixins: [Router.Navigation, Router.State, FlashQueue.Mixin, UserHasRoleMixin, LoadingMixin, UserIsLoggedInMixin],
  getInitialState: function() {
    return {};
  },
  componentDidMount: function() {

    if (!this.userIsLoggedIn()) {
      var src = {
        to : this.routeName()
      };
      sessionStorage.setItem('url', JSON.stringify(src));
      this.transitionTo('login');
      return;
    }

    if (sessionStorage.getItem('url')) {
      var o = JSON.parse(sessionStorage.getItem('url'));
      console.log('Go to ', o.to);
      sessionStorage.removeItem('url');
      if (o.to !== this.routeName()) {
        this.transitionTo(o.to, o.params, o.query);
        return;
      }
    }

    var url = api.reverse('currentUser');
    if (this.props.uuid) {
      url = api.reverse('user_by_uuid', { uuid : this.props.uuid });
    }

    this.loading();
    $.ajax(url, {
      dataType: 'json',
      error: (xhr) => {
        if (xhr.status === 401 || xhr.status === 403) {
          this.loaded();
        } else {
          this.loadingError(url, 'Error retrieving current user');
        }
      },
      success : (profile) => {
        var e = {};
        e.name = (profile.name) ? profile.name : '';
        e.gender = (profile.gender) ? profile.gender : '';
        e.roles = (profile.roles) ? profile.roles : [];
        if (profile.local) {
          e.local = profile.local;
        }
        e.uuid = profile.uuid;
        e.avatar = profile.avatar;
        e.dirty = false;

        this.loaded({profile: e});
        this.props.validate();
      }
    });
  },
  routeName: function() {
    var routeName = this.getRoutes()[this.getRoutes().length - 1].name;
    return routeName;
  },
  handleChangedName: function(evt) {
    this.state.dirty = true;
    this.state.profile.name = evt.target.value;
    this.setState(this.state);
    this.props.validate();
  },
  handleChangedGender: function(evt) {
    this.state.dirty = true;
    this.state.profile.gender = evt.target.value;
    this.setState(this.state);
    this.props.validate();
  },
  handleChangedRoles: function(roles) {
    this.state.dirty = true;
    this.state.profile.roles = roles;
    this.setState(this.state);
    this.props.validate();
  },
  handleChangedPassword : function(evt) {
    this.state.dirty = true;
    this.state.profile.password = evt.target.value;
    this.setState(this.state);
    this.props.validate();
  },
  handleChangedPasswordRepeat : function(evt) {
    this.state.dirty = true;
    this.state.profile.password_repeat = evt.target.value;
    this.setState(this.state);
    this.props.validate();
  },
  getProfile : function() {
    var profile = {
      name: this.state.profile.name,
      gender: this.state.profile.gender
    };

    if (this.state.profile.local) {
      profile.local = {};
    }

    if (this.state.profile.password) {
      profile.local.password = this.state.profile.password;
    }

    if (this.state.avatar) {
      profile.avatar = this.state.avatar;
    }

    // patch would be forbidden if we try to change roles and we're not admin
    if (this.userHasRole('admin') && this.state.profile.roles) {
      profile.roles = this.state.profile.roles;
    }

    return profile;
  },
  handleSubmit: function(evt) {
    evt.preventDefault();

    this.loading();
    var url = api.reverse('user_by_uuid', { uuid : this.state.profile.uuid});
    $.ajax(url, {
      type : 'PATCH',
      data : JSON.stringify(this.getProfile()),
      contentType : 'application/json',
      error : this.loadingError(url, 'Error updating user profile'),
      success : () => {
        this.loaded({ dirty : false });
        this.flash('success', 'Profile succesfully updated!');
      }
    });

  },
  onThumbnail: function(data) {
    this.state.dirty = true;
    this.state.avatar = data.image;
    this.setState(this.state);
    this.props.validate();
  },
  render: function() {

    //console.log("Render Profile with state ", this.state);

    if (!this.userIsLoggedIn()) {
      return (
        <div>
          You are not logged in!
        </div>
      );
    }

    if (!this.state.profile) {
      return (
        <div>
          Loading!
        </div>
      );
    }

    var localAccount = '';
    if (this.state.profile.local) {
      localAccount = (
        <div>
          <h4>Local account</h4>
          <div className="form-group">
            <div className="">
              <label className="control-label" htmlFor="email">Email</label>
               <input type="text"
                className="form-control"
                name="email"
                disabled="disabled"
                value={this.state.profile.local.email} />
            </div>
          </div>
          <div className="form-group">
            <div className="">
              <label className="" htmlFor="password">Password</label>
               <input type="password"
                className="form-control"
                name="password"
                disabled={this.isLoading() ? 'disabled' : ''}
                onChange={this.handleChangedPassword} />
              <Message type="danger" messages={this.props.getValidationMessages('local.password')} />
            </div>
          </div>
          <div className="form-group">
            <div className="">
              <label className="" htmlFor="password_repeat">Repeat Password</label>
              <input type="password"
                className="form-control"
                name="password_repeat"
                disabled={this.isLoading() ? 'disabled' : ''}
                onChange={this.handleChangedPasswordRepeat} />
              <Message type="danger" messages={this.props.getValidationMessages('local.password_repeat')} />
            </div>
          </div>
        </div>
      );
    }
    return (
        <div className="row">
          <form className="form-horizontal container">
            <div className="form-group">
              <div className="">
                <label className="" htmlFor="profile-name">Name</label>
                <input  type="text"
                        className="form-control"
                        id="profile-name"
                        disabled={this.isLoading() ? 'disabled' : ''}
                        placeholder={this.isLoading() ? 'Loading...' : 'Name...'}
                        value={this.state.profile.name}
                        onChange={this.handleChangedName} />
                <Message type="danger" messages={this.props.getValidationMessages('name')} />
              </div>
            </div>

            <div className="form-group">
              <div className="">
                <label className="control-label" htmlFor="email">Avatar</label>
                <UploadImage
                  url={api.reverse('user_thumbnail', {uuid: this.state.profile.uuid})}
                  joi={UserJoi.image}
                  callback={this.onThumbnail}
                  thumbnail={this.state.profile.avatar}
                  thumbnail_width="64px"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="">
                <label className="" htmlFor="profile-gender">Gender</label>
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
                <Message type="danger" messages={this.props.getValidationMessages('gender')} />
              </div>
            </div>

            <div className="form-group">
              <div className="">
                <label className="" htmlFor="profile-roles">Roles</label>
                <TagField
                  disabled={this.userHasRole('admin') ? false : true}
                  key={this.state.profile.uuid + '_roles'}
                  tags={this.state.profile.roles}
                  loading={this.isLoading()}
                  onChange={this.handleChangedRoles} />
                <Message type="danger" messages={this.props.getValidationMessages('roles')} />
              </div>
            </div>

            {localAccount}

            <div className="form-group">
              <div className="col-sm-2"></div>
              <div className="col-sm-10">
                <button id="profile-submit"
                        type="submit"
                        disabled={(this.props.isValid() && this.state.dirty) ? '' : 'disabled'}
                        className="btn btn-default"
                        onClick={this.handleSubmit}>Save Profile</button>
              </div>
            </div>
          </form>
          <div className="container">
            <h3>Scenarios created</h3>
            <ScenariosNewest creator={this.state.profile.uuid} />
          </div>
        </div>
    );
  },
  getValidatorData: function() {
    var profile = this.getProfile();

    if (profile.local && (this.state.profile.password || this.state.profile.password_repeat)) {
      profile.local.password_repeat = (this.state.profile.password_repeat) ? this.state.profile.password_repeat : '';
    }

    return profile;
  },
  validatorTypes: UserJoi.profileClient
});

export default validation(strategy)(Profile);
