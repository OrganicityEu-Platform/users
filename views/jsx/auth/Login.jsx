import $                   from 'jquery';
import React               from 'react';
import UserIsLoggedInMixin from '../UserIsLoggedInMixin.jsx'
import FlashQueue          from '../FlashQueue.jsx';
import LoadingMixin        from '../LoadingMixin.jsx';
import api                 from '../../../api_routes.js';
import ui                  from '../../../ui_routes.js';
import SocialmediaLogin    from './SocialmediaLogin.jsx';

// Input validation
import validation   from 'react-validation-mixin';
import strategy     from 'joi-validation-strategy';
import UserJoi      from '../../../models/joi/user.js';
import Message      from '../Message.jsx';

var Router = require('react-router');
var Link = Router.Link;

var LocalLogin = React.createClass({
  mixins: [Router.Navigation, UserIsLoggedInMixin, FlashQueue.Mixin, LoadingMixin],
  getInitialState : function() {
    return {
      email : '',
      password : '',
      error : null,
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
  handleSubmit : function(evt) {

    evt.preventDefault();

    this.setState({
      error: undefined,
      btnClickedOnce: true
    }, () => {
      this.props.validate((error) => {
        if (!error) {
          this.loading();
          $.ajax(api.reverse('local-login'), {
            error: (xhr, textStatus, errorThrown) => {
              this.loaded();
              if (xhr.status === 422) {
                this.setState({error: 'Error logging in: username and/or password unknown'});
              } else {
                this.flashOnAjaxError(xhr, textStatus, errorThrown);
              }
            },
            success: (currentUser) => {
              this.loaded();
              this.props.onLogin(currentUser);
              this.transitionTo(ui.reverse('profile'));
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
        <div className="row oc-login-wrapper">
          <div className="col-sm-6 col-sm-offset-3">
            <div className="social-logins-wrapper">
              <SocialmediaLogin/>
            </div>
              <Message type="danger" message={this.state.error} />
              <div className="form-group">
                <input type="text"
                  className="oc-input"
                  placeholder="email"
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
                  placeholder="password"
                  name="password"
                  id="password"
                  disabled={this.isLoading() ? 'disabled' : ''}
                  value={this.state.password}
                  onChange={this.handleChangedPassword} />
              </div>
              <Message type="danger" messages={this.props.getValidationMessages('password')} />
              <button
                type="submit"
                className="oc-button"
                disabled={this.isLoading() ? 'disabled' : ''}
                onClick={this.handleSubmit}>Login</button>
              <div className="oc-login-help-wrapper">
                <span className="login-help">Need an account? <Link to="signup" >Signup</Link></span>
                <span className="login-help-forgot-password"><Link to="forgot-password" >Forgot password?</Link></span>
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
