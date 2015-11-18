import $                    from 'jquery';
import React                from 'react';
import Router               from 'react-router';

import api                  from '../../../api_routes.js';
import TagField             from '../form-components/TagField.jsx';
import UploadImage          from '../UploadImage.jsx';

import ValidationIndicator  from '../ValidationIndicator.jsx'

// Mixings
import LoadingMixin         from '../LoadingMixin.jsx';
import UserIsLoggedInMixin  from '../UserIsLoggedInMixin.jsx';
import UserHasRoleMixin     from '../UserHasRoleMixin.jsx';

// Input validation
import validation           from 'react-validation-mixin';
import strategy             from 'joi-validation-strategy';
import UserJoi              from '../../../models/joi/user.js';
import Message              from '../Message.jsx';

import ScenariosNewest      from '../scenarios/ScenariosNewest.jsx';

import lang                 from '../../../lang/en.js'

var Profile = React.createClass({
  mixins: [Router.Navigation, Router.State, LoadingMixin, UserHasRoleMixin, UserIsLoggedInMixin],
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
      //console.log('Go to ', o.to);
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
      error: (xhr, textStatus, errorThrown) => {
        if (xhr.status === 401 || xhr.status === 403) {
          this.loaded();
        } else {
          this.loadingError(url, 'Error retrieving current user')(xhr, textStatus, errorThrown);
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
        this.loaded({profile: e}, () => {
          // Initial validate to show validation indicators
          this.props.validate();
        });

      }
    });
  },
  routeName: function() {
    var routeName = this.getRoutes()[this.getRoutes().length - 1].name;
    return routeName;
  },
  handleChangedName: function(evt) {

    this.setState({
      dirty : true,
      profile : $.extend(this.state.profile, {
        name : evt.target.value
      })
    }, () => {
      if (this.state.btnClickedOnce) {
        this.props.validate();
      } else {
        this.props.validate('name');
      }
    });
  },
  handleChangedGender: function(evt) {
    this.setState({
      dirty : true,
      profile : $.extend(this.state.profile, {
        gender : evt.target.value
      })
    }, () => {
      if (this.state.btnClickedOnce) {
        this.props.validate();
      } else {
        this.props.validate('gender');
      }
    });
  },
  handleChangedRoles: function(roles) {
    this.setState({
      dirty : true,
      profile : $.extend(this.state.profile, {
        roles : roles
      })
    }, () => {
      if (this.state.btnClickedOnce) {
        this.props.validate();
      } else {
        this.props.validate('roles');
      }
    });
  },
  handleChangedPassword : function(evt) {

    this.setState({
      dirty : true,
      profile : $.extend(this.state.profile, {
        password : (evt.target.value === '') ? null : evt.target.value
      })
    }, () => {
      if (this.state.btnClickedOnce) {
        this.props.validate();
      } else {
        this.props.validate('local.password');
        this.props.validate('local.password_repeat');
      }
    });
  },
  handleChangedPasswordRepeat : function(evt) {

    this.setState({
      dirty : true,
      profile : $.extend(this.state.profile, {
        password_repeat : (evt.target.value === '') ? null : evt.target.value
      })
    }, () => {
      if (this.state.btnClickedOnce) {
        this.props.validate();
      } else {
        this.props.validate('local.password');
        this.props.validate('local.password_repeat');
      }
    });
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

    if (this.state.profile.avatar !== undefined) {
      profile.avatar = this.state.profile.avatar;
    }

    // patch would be forbidden if we try to change roles and we're not admin
    if (this.userHasRole('admin') && this.state.profile.roles) {
      profile.roles = this.state.profile.roles;
    }

    return profile;
  },
  handleSubmit: function(evt) {
    evt.preventDefault();

    this.setState({
      error: undefined,
      btnClickedOnce: true
    }, () => {
      this.props.validate((error) => {
        if (!error) {
          if (this.state.dirty) {
            this.loading();
            var url = api.reverse('user_by_uuid', { uuid : this.state.profile.uuid});
            $.ajax(url, {
              type : 'PATCH',
              data : JSON.stringify(this.getProfile()),
              contentType : 'application/json',
              error : this.loadingError(url, 'Error updating user profile'),
              success : () => {
                this.loadingSuccess('Profile succesfully updated!', {
                  dirty : false,
                  btnClickedOnce: false
                });
              }
            });
          } else {
            this.loadingSuccess('Nothing changed!', {
              dirty : false,
              btnClickedOnce: false
            });
          }
        }
      });
    });
  },
  onThumbnail: function(data) {
    this.setState({
      dirty : true,
      profile : $.extend(this.state.profile, {
        avatar: data.image
      })
    }, () => {
      if (this.state.btnClickedOnce) {
        this.props.validate();
      } else {
        this.props.validate('avatar');
      }
    });

  },
  render: function() {

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

    var errorMessageName = null;
    var errorMessageGender = null;
    var errorMessageRoles = null;
    var errorMessagePassword = null;
    var errorMessagePasswordRepeat = null;

    if (this.state.btnClickedOnce) {
      errorMessageName = (<Message type="danger" messages={this.props.getValidationMessages('name')} />);
      errorMessageGender = (<Message type="danger" messages={this.props.getValidationMessages('gender')} />);
      errorMessageRoles = (<Message type="danger" messages={this.props.getValidationMessages('roles')} />);
      errorMessagePassword = (<Message type="danger" messages={this.props.getValidationMessages('local.password')} />);
      errorMessagePasswordRepeat = (<Message type="danger" messages={this.props.getValidationMessages('local.password_repeat')} />);
    }

    var localAccount = null;

    if (this.state.profile.local) {

      localAccount = (
        <div>
          <h2 className="oc-pink">Local account</h2>

          <div className="form-group oc-form-group">
            <label className="control-label col-sm-3" htmlFor="email">E-Mail
              <span className="oc-form-group-info">
                {lang.Profile.emailInfo}
              </span>
            </label>
            <div className="col-sm-9">
              <input type="text"
                className="oc-input"
                name="email"
                disabled="disabled"
                value={this.state.profile.local.email} />
            </div>
          </div>

          <div className="form-group oc-form-group">
            <label className="control-label col-sm-3" htmlFor="password">Password <ValidationIndicator valid={this.props.isValid('local.password')}/>
              <span className="oc-form-group-info">
                {lang.Profile.passwordInfo}
              </span>
            </label>
            <div className="col-sm-9">
               <input type="password"
                className="oc-input"
                name="password"
                disabled={this.isLoading() ? 'disabled' : ''}
                onChange={this.handleChangedPassword} />
              {errorMessagePassword}
            </div>
          </div>

          <div className="form-group oc-form-group">
            <label className="control-label col-sm-3" htmlFor="password_repeat">Password Repeat <ValidationIndicator valid={this.props.isValid('local.password_repeat')}/>
              <span className="oc-form-group-info">
                {lang.Profile.passwordRepeatInfo}
              </span>
            </label>
            <div className="col-sm-9">
              <input type="password"
                className="oc-input"
                name="password_repeat"
                disabled={this.isLoading() ? 'disabled' : ''}
                onChange={this.handleChangedPasswordRepeat} />
              {errorMessagePasswordRepeat}
            </div>
          </div>
        </div>

      );
    }

    var roleIndicator = null;
    if (this.userHasRole('admin')) {
      roleIndicator = (<ValidationIndicator valid={this.props.isValid('roles')}/>);
    }

    return (
      <div className="container oc-form-group-view">
        <div className="row">
          <h1 className="oc-pink">Profile</h1>
          <form className="form-horizontal">

            <div className="form-group oc-form-group">
              <label className="control-label col-sm-3" htmlFor="name">Name <ValidationIndicator valid={this.props.isValid('name')}/>
                <span className="oc-form-group-info">
                  {lang.Profile.nameInfo}
                </span>
              </label>
              <div className="col-sm-9">
                <input
                  type="text"
                  className="oc-input"
                  id="name"
                  disabled={this.isLoading() ? 'disabled' : ''}
                  placeholder={this.isLoading() ? 'Loading...' : 'Name...'}
                  value={this.state.profile.name}
                  onChange={this.handleChangedName} />
                {errorMessageName}
              </div>
            </div>

            <div className="form-group oc-form-group">
              <label className="control-label col-sm-3" htmlFor="avatar">Avatar <ValidationIndicator valid={this.props.isValid('avatar')}/>
                <span className="oc-form-group-info">
                  {lang.Profile.avatarInfo}
                </span>
              </label>
              <div className="col-sm-9">
                <UploadImage
                  url={api.reverse('user_thumbnail', {uuid: this.state.profile.uuid})}
                  joi={UserJoi.image}
                  disabled={this.isLoading() ? 'disabled' : ''}
                  callback={this.onThumbnail}
                  thumbnail={this.state.profile.avatar}
                  thumbnail_width="64px"
                />
              </div>
            </div>

            <div className="form-group oc-form-group">
              <label className="control-label col-sm-3" htmlFor="gender">Gender <ValidationIndicator valid={this.props.isValid('gender')}/>
                <span className="oc-form-group-info">
                  {lang.Profile.genderInfo}
                </span>
              </label>
              <div className="col-sm-9">
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
                {errorMessageGender}
              </div>
            </div>

            <div className="form-group oc-form-group">
              <label className="control-label col-sm-3" htmlFor="name">Roles {roleIndicator}
                <span className="oc-form-group-info">
                  {lang.Profile.rolesInfo}
                </span>
              </label>
              <div className="col-sm-9">
                <TagField
                  disabled={this.userHasRole('admin') ? false : true}
                  key={this.state.profile.uuid + '_roles'}
                  tags={this.state.profile.roles}
                  loading={this.isLoading()}
                  onChange={this.handleChangedRoles} />
                {errorMessageRoles}
              </div>
            </div>

            {localAccount}

            <div className="form-group">
              <div className="col-md-2 col-md-offset-5">
                <button
                  type="button"
                  className="oc-button"
                  disabled={this.isLoading() ? 'disabled' : ''}
                  onClick={this.handleSubmit}
                >Save Profile</button>
              </div>
            </div>

            <h2 className="oc-pink">Scenarios created</h2>
            <ScenariosNewest creator={this.state.profile.uuid} counter={true}/>

          </form>
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
