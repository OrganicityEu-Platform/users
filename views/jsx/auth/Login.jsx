import $                    from 'jquery';
import React                from 'react';
import Router               from 'react-router';

import UserIsLoggedInMixin  from '../UserIsLoggedInMixin.jsx'
import LoadingMixin         from '../LoadingMixin.jsx';
import FlashQueue           from '../FlashQueue.jsx';

import api                  from '../../../api_routes.js';
import ui                   from '../../../ui_routes.js';
import config               from '../../../config/config.js';
import SocialmediaLogin     from './SocialmediaLogin.jsx';

// Input validation
import validation   from 'react-validation-mixin';
import strategy     from 'joi-validation-strategy';
import UserJoi      from '../../../models/joi/user.js';
import Message      from '../Message.jsx';

import DocumentTitle      from 'react-document-title';
import I18nMixin from '../i18n/I18nMixin.jsx';

var Link = Router.Link;

var LocalLogin = React.createClass({
  mixins: [Router.Navigation, UserIsLoggedInMixin, FlashQueue.Mixin, LoadingMixin, I18nMixin],
  getInitialState : function() {
    return {
      email : '',
      password : '',
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
  loginSuccess: function() {
    var msg = this.i18n('login_successful', 'Login successful.');
    this.flash("success", msg);
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
          var url = api.reverse('local-login');
          $.ajax(url, {
            error: this.loadingError(url, 'Log in failed'),
            success: (currentUser) => {
              this.loaded();
              this.props.onLogin(currentUser);
              if(sessionStorage.getItem('prevScenario') && sessionStorage.getItem('prevScenarioScore')) {
                this.transitionTo('scenarioView', { uuid : sessionStorage.getItem('prevScenario') });
                sessionStorage.removeItem('prevScenario');
                sessionStorage.removeItem('prevScenarioScore');
              }else if(sessionStorage.getItem('srcPath')) {

                var srcPath = JSON.parse(sessionStorage.getItem('srcPath'));

                if(srcPath.route === 'scenarioView') {
                  this.transitionTo('scenarioView', {uuid: srcPath.params.uuid});
                  sessionStorage.removeItem('srcPath');
                  this.loginSuccess();
                }else if(srcPath.route === 'userView') {
                  this.transitionTo('userView', {uuid: srcPath.params.uuid});
                  sessionStorage.removeItem('srcPath');
                  this.loginSuccess();
                }else {
                  if(srcPath.route === 'login' || srcPath.route === 'signup') {
                    this.transitionTo(ui.reverse('profile'));
                    sessionStorage.removeItem('srcPath');
                    this.loginSuccess();
                  }else {
                    this.transitionTo(ui.reverse(srcPath.route));
                    sessionStorage.removeItem('srcPath');
                    this.loginSuccess();
                  }
                }
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

    return (
      <form>
        <DocumentTitle title={config.title + ' | Login'} />
        <div className="row">
          <div className="oc-login-wrapper col-sm-4 col-sm-offset-4">
            <h1 className="oc-pink oc-login-signup-title">{this.i18n('log_in', 'Log in')}</h1>
            <div className="social-logins-wrapper">
              <SocialmediaLogin/>
            </div>
              <div className="form-group">
                <input type="text"
                  className="oc-input"
                  placeholder={this.i18n('email', 'email')}
                  name="email"
                  id="email"
                  disabled={this.isLoading() ? 'disabled' : ''}
                  value={this.state.email}
                  onChange={this.handleChangedEmail} />
              </div>
              <Message type="danger" messages={this.props.getValidationMessages('email')} />
              <div className="form-group">
                <input type="password"
                  className="oc-input"
                  placeholder={this.i18n('password', 'password')}
                  name="password"
                  id="password"
                  disabled={this.isLoading() ? 'disabled' : ''}
                  value={this.state.password}
                  onChange={this.handleChangedPassword} />
              </div>
              <Message type="danger" messages={this.props.getValidationMessages('password')} />
              <button
                type="submit"
                className="oc-button all-uppercase"
                disabled={this.isLoading() ? 'disabled' : ''}
                onClick={this.handleSubmit}>{this.i18n('log_in', 'LOG IN')}</button>
              <div className="oc-login-help-wrapper">
                <span className="login-help">{this.i18n('need_an_account', 'Need an account?')} <Link to="signup" >{this.i18n('sign_up', 'Sign up')}</Link></span>
                <span className="login-help-forgot-password"><Link to="forgot-password" >{this.i18n('forgot_password', 'Forgot password?')}</Link></span>
              </div>
          </div>
        </div>
      </form>
    );
  },
  getValidatorData: function() {
    var data = {
      email           : this.state.email,
      password        : this.state.password
    };
    return data;
  },
  validatorTypes: UserJoi.emailAndPassword
});

export default validation(strategy)(LocalLogin);
