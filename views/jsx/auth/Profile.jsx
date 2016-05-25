import $                    from 'jquery';
import React                from 'react';
import Router               from 'react-router';

import api                  from '../../../api_routes.js';
import config               from '../../../config/config.js';
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

import DocumentTitle        from 'react-document-title';

import Select               from 'react-select';

import login                from '../../../config/login.js';
import I18nMixin            from '../i18n/I18nMixin.jsx';

import BookmarkedScenarios  from '../scenarios/BookmarkedScenarios.jsx';

var Profile = React.createClass({
  mixins: [Router.Navigation, Router.State, LoadingMixin, UserHasRoleMixin, UserIsLoggedInMixin, I18nMixin],
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

        console.log('XHR:', profile);

        var e = {};
        e.name = (profile.name) ? profile.name : '';
        e.gender = (profile.gender) ? profile.gender : '';
        e.roles = (profile.roles) ? profile.roles : [];
        if (profile.local) {
          e.local = profile.local;
        }
        e.uuid = profile.uuid;
        e.avatar = profile.avatar;
        e.location = profile.location;
        e.publicEmail = profile.publicEmail;
        e.publicWebsite = profile.publicWebsite;
        e.dirty = false;
        e.favorites = profile.favorites;
        e.profession = (profile.profession) ? profile.profession : [];
        e.professionTitle = (profile.professionTitle) ? profile.professionTitle : '';

        this.loaded({profile: e}, () => {
          // Initial validate to show validation indicators
          this.props.validate();
        });

        this.setState({
          google: profile.google,
          facebook: profile.facebook,
          twitter: profile.twitter,
          github: profile.github,
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
  handleChangedpublicEmail: function(evt) {
    this.setState({
      dirty : true,
      profile : $.extend(this.state.profile, {
        publicEmail : evt.target.value
      })
    }, () => {
      if (this.state.btnClickedOnce) {
        this.props.validate();
      } else {
        this.props.validate('publicEmail');
      }
    });
  },
  handleChangedpublicWebSite: function(evt) {
    this.setState({
      dirty : true,
      profile : $.extend(this.state.profile, {
        publicWebsite : evt.target.value
      })
    }, () => {
      if (this.state.btnClickedOnce) {
        this.props.validate();
      } else {
        this.props.validate('publicWebsite');
      }
    });
  },
  handleChangedProfessionTitle: function(evt) {
    this.setState({
      dirty : true,
      profile : $.extend(this.state.profile, {
        professionTitle : evt.target.value
      })
    }, () => {
      if (this.state.btnClickedOnce) {
        this.props.validate();
      } else {
        this.props.validate('professionTitle');
      }
    });
  },
  handleChangedLocation: function(evt) {
    this.setState({
      dirty : true,
      profile : $.extend(this.state.profile, {
        location : evt.target.value
      })
    }, () => {
      if (this.state.btnClickedOnce) {
        this.props.validate();
      } else {
        this.props.validate('location');
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
  handleChangedProfession: function(profession) {
    this.setState({
      dirty : true,
      profile : $.extend(this.state.profile, {
        profession : (profession === '') ? [] : profession.split(",")
      })
    }, () => {
      if (this.state.btnClickedOnce) {
        this.props.validate();
      } else {
        this.props.validate('profession');
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
      gender: this.state.profile.gender,
      location: this.state.profile.location,
      profession: this.state.profile.profession,
      professionTitle : this.state.profile.professionTitle,
      publicEmail: this.state.profile.publicEmail,
      publicWebsite: this.state.profile.publicWebsite,
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
      if (this.state.dirty) {
        this.props.validate((error) => {
          if (!error) {
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
            console.log('Validation error:', error);
          }
        });
      } else {
        this.loadingSuccess('Nothing changed!', {
          dirty : false,
          btnClickedOnce: false
        });
      }
    });
  },
  render: function() {

    var that = this;

    if (!this.userIsLoggedIn()) {
      return (
        <div>
          You are not logged in!
        </div>
      );
    }

    if (!this.state.profile) {
      return this.renderLoading();
    }

    var errorMessageName = null;
    var errorMessageGender = null;
    var errorMessageRoles = null;
    var errorMessagePassword = null;
    var errorMessagePasswordRepeat = null;
    var errorMessageProfession = null;

    if (this.state.btnClickedOnce) {
      errorMessageName = (
        <Message
          type="danger"
          messages={this.props.getValidationMessages('name')} />
      );
      errorMessageGender = (
        <Message
          type="danger"
          messages={this.props.getValidationMessages('gender')} />
      );
      errorMessageRoles = (
        <Message
          type="danger"
          messages={this.props.getValidationMessages('roles')} />
      );
      errorMessagePassword = (
        <Message
          type="danger"
          messages={this.props.getValidationMessages('local.password')} />
      );
      errorMessagePasswordRepeat = (
        <Message
          type="danger"
          messages={this.props.getValidationMessages('local.password_repeat')} />
      );
      errorMessageProfession = (
        <Message
          type="danger"
          messages={this.props.getValidationMessages('profession')} />
      );
    }

    var localAccount = null;

    if (this.state.profile.local) {

      localAccount = (
        <div>
          <DocumentTitle title={config.title + ' | Profile '} />
          <h2 className="pink">
            {this.i18n('Profile.account_settings', 'Account settings')}
          </h2>
          <div className="form-group oc-form-group oc-edit-group">
            <label
              className="control-label col-sm-3 first-letter-uppercase"
              htmlFor="email">
              {this.i18n('Profile.email', 'Email')}
              <span className="oc-form-group-info">
                {this.i18n('Profile.emailInfo', 'Sign-in details')}
              </span>
            </label>
            <div className="col-sm-9">
              <input
                type="text"
                className="oc-input"
                name="email"
                disabled="disabled"
                value={this.state.profile.local.email} />
            </div>
          </div>

          <div className="form-group oc-form-group oc-edit-group">
            <label
              className="control-label col-sm-3"
              htmlFor="password">
              {this.i18n('Profile.password', 'Password')} <ValidationIndicator valid={this.props.isValid('local.password')}/>
            <span className="oc-form-group-info">
              {this.i18n('Profile.passwordInfo', 'Type a new password for your login. The password must contain at least 6 characters.')}
            </span>
          </label>
          <div className="col-sm-9">
            <input
              type="password"
              className="oc-input"
              name="password"
              disabled={this.isLoading() ? 'disabled' : ''}
              onChange={this.handleChangedPassword} />
            {errorMessagePassword}
          </div>
        </div>

        <div className="form-group oc-form-group oc-edit-group">
          <label
            className="control-label col-sm-3"
            htmlFor="password_repeat">
            {this.i18n('Profile.password_repeat', 'Password Repeat')} <ValidationIndicator valid={this.props.isValid('local.password_repeat')}/>
          <span className="oc-form-group-info">
            {this.i18n('Profile.passwordRepeatInfo', 'If you have selected a new password, please repeat it here.')}
          </span>
        </label>
        <div className="col-sm-9">
          <input
            type="password"
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

var roles = null;

if(this.userHasRole('admin') || this.state.profile.roles.length > 0) {

  // Only show the indicator, if admin
  var roleIndicator = null;
  if (this.userHasRole('admin')) {
    roleIndicator = (
      <ValidationIndicator valid={this.props.isValid('roles')}/>
    );
  }

  roles = (
    <div className="form-group oc-form-group oc-edit-group">
      <label
        className="control-label col-sm-3"
        htmlFor="name">
        {this.i18n('Profile.roles', 'Roles')} {roleIndicator}
        <span className="oc-form-group-info">
          {this.i18n('Profile.rolesInfo', 'The roles you have in this scenario tool. For example, you could be a moderator.')}
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
  );
}

//icon-eye-open icon-eye-close

function socialLink(name, icon) {

  return null; // Disable social links

  var unlink = function(name) {
    return function(evt) {
      evt.preventDefault();

      $.ajax(api.reverse('disconnect_' + name, { uuid : that.state.profile.uuid }), {
        error: (xhr, textStatus, errorThrown) => {
          console.log('ERROR');
        },
        success : (profile) => {
          var newState = {};
          newState[name] = {
            public : false,
            id : undefined
          };

          console.log(newState);
          that.setState(newState);
        }
      });
    }
  }

  var changeVisability = function(name, e) {
    return function (evt) {
      evt.preventDefault();

      var b = !e.public;
      console.log('Change visability for ', name, 'to', b);

      var data = {};
      data[name] = { public : b}

      $.ajax(api.reverse('user-update-viablility', { uuid : that.state.profile.uuid }), {
        type : 'PATCH',
        data : JSON.stringify(data),
        contentType : 'application/json',
        error: (xhr, textStatus, errorThrown) => {
          console.log('ERROR');
        },
        success : (profile) => {
          var newState = {};
          newState[name] = that.state[name];
          newState[name].public = !e.public;
          console.log(newState);
          that.setState(newState);
        }
      });
    }
  }

  // Disable linking
  if(!login[name]) return null;

  var e = that.state[name];
  if(e && e.id) {
    return (
      <div>
        <button
          type="button"
          className="oc-link-social-unlink"
          onClick={unlink(name)}>
          Unlink <span className={icon}/>
      </button>
      <button
        type="button"
        className="oc-link-social"
        onClick={changeVisability(name, e)}
        title="Show this on your public profile">
        <span className={e.public ? "fa fa-eye" : "fa fa-eye-slash"}/>
      </button>
    </div>
  );
} else {
  return (
    <div>
      <a
        className="oc-link-social-link"
        href={api.reverse('auth_' + name)}>
        Link with <span className={icon}></span>
    </a>
  </div>
);
}
}

var linkTwitter = socialLink('twitter', 'fa fa-twitter');
var linkFacebook = socialLink('facebook', 'fa fa-facebook');
var linkGoogle = socialLink('google', 'fa fa-google-plus');
var linkGithub = socialLink('github', 'fa fa-github');

var socialLinks = (
  <div>
    <h2 className="pink">
      Social links
    </h2>

    <div className="form-group oc-form-group oc-edit-group">
      <label
        className="control-label col-sm-3"
        htmlFor="name">
        Social links
        <span className="oc-form-group-info">
          {lang.Profile.socialInfo}
        </span>
      </label>
      <div className="col-sm-9">
        {linkTwitter}
        {linkFacebook}
        {linkGoogle}
        {linkGithub}
      </div>
    </div>
  </div>
);

socialLinks = null;

var options = [
  { value: 'Academic', label: 'Academic' },
  { value: 'Artist', label: 'Artist' },
  { value: 'Business owner', label: 'Business owner' },
  { value: 'Designer', label: 'Designer' },
  { value: 'Developer', label: 'Developer' },
  { value: 'Entrepreneur', label: 'Entrepreneur' },
  { value: 'Government', label: 'Government' },
  { value: 'Manager', label: 'Manager' },
  { value: 'Policy maker', label: 'Policy maker' },
  { value: 'Researcher', label: 'Researcher' },
  { value: 'Student (school)', label: 'Student (school)' },
  { value: 'Student (university)', label: 'Student (university)' },
  { value: 'Technology expert', label: 'Technology expert' },
  { value: 'Urbanist', label: 'Urbanist' },
  { value: 'Other', label: 'Other' },
];

return (
  <div className="row oc-form-group-view">
    <div className="oc-macro-content">
      <h1 className="oc-pink">
        {this.i18n('Profile.public_profile', 'Public profile')}
      </h1>
      <h4 className="oc-profile-info">
        {this.i18n('Profile.your_profile_allows', 'Your profile allows you to connect, share and discuss ideas with others')}
      </h4>
      <form className="form-horizontal">

        <div className="form-group oc-form-group oc-edit-group">
          <label
            className="control-label col-sm-3"
            htmlFor="name">
            {this.i18n('Profile.my_name', 'My name')} <ValidationIndicator valid={this.props.isValid('name')}/>
          <span className="oc-form-group-info">
            {this.i18n('Profile.nameInfo', 'Use your real name or a nickname.')}
          </span>
        </label>
        <div className="col-sm-9">
          <input
            type="text"
            className="oc-input"
            id="name"
            disabled={this.isLoading() ? 'disabled' : ''}
            placeholder={this.isLoading() ? 'Loading...' : this.i18n('Profile.name_or_nick', 'Name or nickname')}
            value={this.state.profile.name}
            onChange={this.handleChangedName} />
          {errorMessageName}
        </div>
      </div>

      <div className="form-group oc-form-group oc-edit-group">
        <label
          className="control-label col-sm-3"
          htmlFor="location">
          {this.i18n('Profile.my_location', 'My location')}
          <span className="oc-form-group-info">
            {this.i18n('Profile.locationInfo', '')}
          </span>
        </label>
        <div className="col-sm-9">
          <input
            type="text"
            className="oc-input"
            id="location"
            disabled={this.isLoading() ? 'disabled' : ''}
            placeholder={this.isLoading() ? 'Loading...' : this.i18n('Profile.location_placeholder', 'I\'m at...')}
            value={this.state.profile.location}
            onChange={this.handleChangedLocation} />
        </div>
      </div>

      <div className="form-group oc-form-group oc-edit-group">
        <label
          className="control-label col-sm-3"
          htmlFor="profession">
          {this.i18n('Profile.profession', 'What do you do?')} <ValidationIndicator valid={this.props.isValid('profession')}/>
        <span className="oc-form-group-info">
          {this.i18n('Profile.professionInfo', '')}
        </span>
      </label>
      <div className="col-sm-9">
        <Select
          name="form-field-name"
          value={this.state.profile.profession}
          options={options}
          placeholder={this.i18n('Profile.profession_placeholder1', 'Select...')}
          onChange={this.handleChangedProfession}
          multi={true}/>
        <input
          type="text"
          className="oc-input"
          id="profession"
          disabled={this.isLoading() ? 'disabled' : ''}
          placeholder={this.isLoading() ? 'Loading...' : this.i18n('Profile.profession_placeholder2', 'Specific title and/or field...')}
          value={this.state.profile.professionTitle}
          onChange={this.handleChangedProfessionTitle} />
        {errorMessageProfession}
      </div>
    </div>

    <div className="form-group oc-form-group oc-edit-group">
      <label
        className="control-label col-sm-3"
        htmlFor="gender">
        {this.i18n('Profile.gender', 'My gender')} <ValidationIndicator valid={this.props.isValid('gender')}/>
      <span className="oc-form-group-info">
        {this.i18n('Profile.genderInfo', 'Which describes how you think of yourself? This will help us with EU statistics and won’t show in your profile.')}
      </span>
    </label>
    <div className="col-sm-9">
      <input
        type="radio"
        name="gender"
        value="m"
        disabled={this.isLoading() ? 'disabled' : ''}
        checked={this.state.profile.gender === 'm'}
        onChange={this.handleChangedGender} />
      {this.i18n('Profile.gender_m', 'Male')}
      <br/>
      <input
        type="radio"
        name="gender"
        value="f"
        disabled={this.isLoading() ? 'disabled' : ''}
        checked={this.state.profile.gender === 'f'}
        onChange={this.handleChangedGender} />
      {this.i18n('Profile.gender_f', 'Female')}
      <br/>
      <input
        type="radio"
        name="gender"
        value="o"
        disabled={this.isLoading() ? 'disabled' : ''}
        checked={this.state.profile.gender === 'o'}
        onChange={this.handleChangedGender} />
      {this.i18n('Profile.gender_o', 'Other')}
      <br/>
      {errorMessageGender}
    </div>
  </div>

  {roles}

  <div className="form-group oc-form-group oc-edit-group">
    <label
      className="control-label col-sm-3"
      htmlFor="name">
      {this.i18n('Profile.public_contact', 'Public contact')}
      <span className="oc-form-group-info">
        {this.i18n('Profile.public_contact_info', '')}
      </span>
    </label>
    <div className="col-sm-9">
      <input
        type="text"
        className="oc-input"
        id="name"
        disabled={this.isLoading() ? 'disabled' : ''}
        placeholder={this.isLoading() ? 'Loading...' : this.i18n('Profile.email', 'email')}
        value={this.state.profile.publicEmail}
        onChange={this.handleChangedpublicEmail} />
      <br/>
      <input
        type="text"
        className="oc-input"
        id="name"
        disabled={this.isLoading() ? 'disabled' : ''}
        placeholder={this.isLoading() ? 'Loading...' : this.i18n('Profile.website', 'website')}
        value={this.state.profile.publicWebsite}
        onChange={this.handleChangedpublicWebSite} />
      <br/>
    </div>
  </div>

  <div className="form-group">
    <div className="oc-save-profile-btn-wrapper">
      <button
        type="button"
        className="oc-button"
        disabled={this.isLoading() ? 'disabled' : ''}
        onClick={this.handleSubmit}
        >
        {this.i18n('Profile.save', 'SAVE PROFILE')}
      </button>
    </div>
  </div>

  {socialLinks}
  {localAccount}

  <h2 className="pink">
    {this.i18n('Profile.your_scenarios', 'Your scenarios')}
  </h2>

  <ScenariosNewest
    creator={this.state.profile.uuid}
    counter={true}/>
  <BookmarkedScenarios bundle={this.state.profile.favorites}/>
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

  console.log('Profile to submit: ', profile);

  return profile;
},
validatorTypes: UserJoi.profileClient
});

export default validation(strategy)(Profile);
