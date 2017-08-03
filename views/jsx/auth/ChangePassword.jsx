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

import UserInterests        from '../users/UserInterests.jsx';

import moment               from 'moment';



var Profile = React.createClass({
  mixins: [Router.Navigation, Router.State, LoadingMixin, UserHasRoleMixin, UserIsLoggedInMixin, I18nMixin],
  getInitialState: function() {
    return {
      password : undefined,
      password_repeat: undefined,
      uuid : undefined
    };
  },
  componentDidMount: function() {
    var url = api.reverse('currentUser');
    $.ajax(url, {
      dataType: 'json',
      success : (user) => {
        this.setState({
          uuid : user.uuid
        });
      },
      error : (xhr, textStatus, errorThrown) => {
        /*
        if (xhr.status === 401) {
          this.onLogout();
        } else {
          this.flashOnAjaxError(url, 'Error retrieving current user')(xhr, textStatus, errorThrown);
        }
        */
      }
    });
  },
  handleChangedPassword : function(evt) {
    this.setState({
      dirty : true,
      profile : $.extend(this.state, {
        password : (evt.target.value === '') ? null : evt.target.value
      })
    }, () => {
      if (this.state.btnClickedOnce) {
        this.props.validate();
      } else {
        this.props.validate('password');
        this.props.validate('password_repeat');
      }
    });
  },
  handleChangedPasswordRepeat : function(evt) {
    this.setState({
      dirty : true,
      profile : $.extend(this.state, {
        password_repeat : (evt.target.value === '') ? null : evt.target.value
      })
    }, () => {
      if (this.state.btnClickedOnce) {
        this.props.validate();
      } else {
        this.props.validate('password');
        this.props.validate('password_repeat');
      }
    });
  },
  handleSubmit: function(evt) {
    evt.preventDefault();
    // TODO: Handle JOI validation

    console.log('UUID:', this.state.uuid);

    var url = api.reverse('reset_password', { uuid : this.state.uuid});

    this.setState({
      error: undefined,
      btnClickedOnce: true
    }, () => {
      if (this.state.dirty) {
        this.props.validate((error) => {
          if (!error) {
            this.loading();
            console.log('Validation succesful');
            $.ajax(url, {
              type : 'PUT',
              data : JSON.stringify({password : this.state.password}),
              contentType : 'application/json',
              error : this.loadingError(url, 'Error updating password'),
              success : () => {
                this.loadingSuccess('Pasword succesfully updated!', {
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

    var errorMessagePassword = null;
    var errorMessagePasswordRepeat = null;

    if (this.state.btnClickedOnce) {
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
    }

    return (
      <div className="row oc-form-group-view">
        <div className="oc-macro-content">
          <h1 className="oc-pink">
            {this.i18n('change_password', 'Change password')}
          </h1>
          <DocumentTitle title={config.title + ' | Reset Password'} />
          <div className="row">
            <div className="col-sm-6 col-sm-offset-3">
              <div className="form-group">
                <input type="password"
                  className="oc-input"
                  placeholder="password"
                  value={this.state.password}
                  disabled={this.isLoading() ? 'disabled' : ''}
                  onChange={this.handleChangedPassword} />
                <Message type="danger" messages={this.props.getValidationMessages('password')} />
              </div>
              <div className="form-group">
                <input type="password"
                  className="oc-input"
                  placeholder="repeat password"
                  disabled={this.isLoading() ? 'disabled' : ''}
                  value={this.state.password_repeat}
                  onChange={this.handleChangedPasswordRepeat} />
                <Message type="danger" messages={this.props.getValidationMessages('password_repeat')} />
              </div>
              <div className="form-group">
                <button
                  type="submit"
                  className = "oc-button"
                  disabled={this.isLoading() ? 'disabled' : ''}
                  onClick={this.handleSubmit}>Update password</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
  getValidatorData: function() {
    return this.state;
  },
  validatorTypes: UserJoi.resetPassword
});

export default validation(strategy)(Profile);
