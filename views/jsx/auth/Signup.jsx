import $                from 'jquery';
import React            from 'react';
import api              from '../../../api_routes.js';
import ui               from '../../../ui_routes.js';
import config           from '../../../config/config.js';
import SocialmediaLogin from './SocialmediaLogin.jsx';

import FlashQueue       from '../FlashQueue.jsx';
import LoadingMixin     from '../LoadingMixin.jsx';
import I18nMixin        from '../i18n/I18nMixin.jsx';

// Input validation
import validation       from 'react-validation-mixin';
import strategy         from 'joi-validation-strategy';
import UserJoi          from '../../../models/joi/user.js';
import Message          from '../Message.jsx';

import DocumentTitle      from 'react-document-title';

var Router = require('react-router');
var Link = Router.Link;
var Navigation = Router.Navigation;

var Signup = React.createClass({
  mixins: [Navigation, FlashQueue.Mixin, LoadingMixin, I18nMixin],
  getInitialState : function() {
    return {
      email : '',
      password : '',
      password_repeat : '',
      btnClickedOnce : false
    };
  },
  handleChangedEmail : function(evt) {
    this.setState({email: evt.target.value}, () => {
      if (this.state.btnClickedOnce) {
        this.props.validate();
      }
    });
  },
  handleChangedPassword : function(evt) {
    this.setState({password: evt.target.value}, () => {
      if (this.state.btnClickedOnce) {
        this.props.validate();
      }
    });
  },
  handleChangedPasswordRepeat : function(evt) {
    this.setState({password_repeat: evt.target.value}, () => {
      if (this.state.btnClickedOnce) {
        this.props.validate();
      }
    });
  },
  handleSubmit : function(evt) {
    evt.preventDefault();

    this.setState({
      btnClickedOnce: true
    }, () => {
      this.props.validate((error) => {
        if (error) {
          this.flash('danger', 'Some fields are not valid.');
        } else {
          this.loading();
          var url = api.reverse('signup');
          $.ajax(url, {
            error: this.loadingError(url, 'Signup failed'),
            success: (currentUser) => {
              this.loadingSuccess('New account created.');
              this.props.onLogin(currentUser);
              if(sessionStorage.getItem('prevScenario') && sessionStorage.getItem('prevScenarioScore')) {
                this.transitionTo('scenarioView', { uuid : sessionStorage.getItem('prevScenario') });
                sessionStorage.removeItem('prevScenario');
                sessionStorage.removeItem('prevScenarioScore');
              }else {
                this.transitionTo(ui.reverse('profile'));
              }
            },
            method: 'POST',
            data: {
              email: this.state.email,
              password: this.state.password
            }
          });
        }
      });
    });
  },
  render : function() {

    var title = config.title + ' | ' + this.i18n('Signup.signup', 'Sign up');

    return (
      <form>
        <DocumentTitle title={title} />
        <div className="row">
          <div className="oc-signup-wrapper col-sm-4 col-sm-offset-4">
            <h1 className="oc-pink oc-login-signup-title">{this.i18n('Signup.signup', 'Sign up')}</h1>
              <p className="oc-signup-description">
                <span>{this.i18n('Signup.share_ideas', 'Share ideas, discuss and')}</span>
                <span>{this.i18n('Signup.connect_with', 'connect with other innovators.')}</span>
              </p>
            <div className="social-logins-wrapper">
              <SocialmediaLogin/>
            </div>
            <div className="form-group">
              <input type="text"
                className="oc-input"
                placeholder={this.i18n('Signup.email', 'email')}
                name="email"
                value={this.state.email}
                disabled={this.isLoading() ? 'disabled' : ''}
                onChange={this.handleChangedEmail} />
              <Message type="danger" messages={this.props.getValidationMessages('email')} />
            </div>
            <div className="form-group">
              <input type="password"
                className="oc-input"
                placeholder={this.i18n('Signup.password', 'password with at least at least 6 characters')}
                name="password"
                value={this.state.password}
                disabled={this.isLoading() ? 'disabled' : ''}
                onChange={this.handleChangedPassword} />
              <Message type="danger" messages={this.props.getValidationMessages('password')} />
            </div>
            <div className="form-group">
              <input type="password"
                className="oc-input"
                placeholder={this.i18n('Signup.repeat_password', 'repeat password')}
                name="password_repeat"
                disabled={this.isLoading() ? 'disabled' : ''}
                value={this.state.password_repeat}
                onChange={this.handleChangedPasswordRepeat} />
              <Message type="danger" messages={this.props.getValidationMessages('password_repeat')} />
            </div>
            <button type="submit"
              className="oc-button all-uppercase"
              disabled={this.isLoading() ? 'disabled' : ''}
              onClick={this.handleSubmit}>{this.i18n('Signup.signup', 'SIGN UP')}</button>
            <div className="oc-signup-help-wrapper">
              <span className="signup-help">{this.i18n('Signup.have_account', 'Already have an account?')}
                &nbsp;
                <Link to="login">{this.i18n('Signup.login', 'Log in')}</Link>
              </span>
            </div>
          </div>
        </div>
      </form>
    );
  },
  getValidatorData: function() {
    var data = {
      email           : this.state.email,
      password        : this.state.password,
      password_repeat : this.state.password_repeat
    };
    return data;
  },
  validatorTypes: UserJoi.signupClient
});

export default validation(strategy)(Signup);
