import $                from 'jquery';
import React            from 'react';
import FlashQueue       from '../FlashQueue.jsx';
import LoadingMixin     from '../LoadingMixin.jsx';
import api              from '../../../api_routes.js';
import ui               from '../../../ui_routes.js';
import SocialmediaLogin from './SocialmediaLogin.jsx';

// Input validation
import validation       from 'react-validation-mixin';
import strategy         from 'joi-validation-strategy';
import UserJoi          from '../../../models/joi/user.js';
import Message          from '../Message.jsx';

var Router = require('react-router');
var Link = Router.Link;
var Navigation = Router.Navigation;

var Signup = React.createClass({
  mixins: [Navigation, FlashQueue.Mixin, LoadingMixin],
  getInitialState : function() {
    return {
      email : '',
      password : '',
      password_repeat : '',
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
      error: undefined,
      btnClickedOnce: true
    }, () => {
      this.props.validate((error) => {
        if (!error) {
          if (this.props.isValid()) {
            this.loading();
            var url = api.reverse('signup');
            $.ajax(url, {
              error: (xhr, textStatus, errorThrown) => {
                this.loaded();
                var error = JSON.parse(xhr.responseText);
                if (xhr.status === 422) {
                  this.state.error = error.message;
                  this.setState(this.state);
                } else {
                  this.flashOnAjaxError(xhr, textStatus, errorThrown);
                }
              },
              success: (currentUser) => {
                this.loaded();
                this.props.onLogin(currentUser);
                this.transitionTo(ui.route('profile'));
              },
              method: 'POST',
              data: {
                email: this.state.email,
                password: this.state.password
              }
            });
          }
        }
      });
    });
  },
  render : function() {

    return (
      <form>
      <div className="row oc-signup-wrapper">
        <div className="col-sm-6 col-sm-offset-3">
          <div className="social-logins-wrapper">
            <SocialmediaLogin/>
          </div>
          <Message type="danger" message={this.state.error} />
          <div className="form-group">
              <input type="text"
                className="form-control oc-signup-email"
                placeholder="email"
                name="email"
                value={this.state.email}
                disabled={this.isLoading() ? 'disabled' : ''}
                onChange={this.handleChangedEmail} />
              <Message type="danger" messages={this.props.getValidationMessages('email')} />
          </div>
          <div className="form-group">
              <input type="password"
                className="form-control oc-signup-password"
                placeholder="password with at least at least 6 characters"
                name="password"
                value={this.state.password}
                disabled={this.isLoading() ? 'disabled' : ''}
                onChange={this.handleChangedPassword} />
              <Message type="danger" messages={this.props.getValidationMessages('password')} />
          </div>
          <div className="form-group">
              <input type="password"
                className="form-control oc-signup-password"
                placeholder="repeat password"
                name="password_repeat"
                disabled={this.isLoading() ? 'disabled' : ''}
                value={this.state.password_repeat}
                onChange={this.handleChangedPasswordRepeat} />
              <Message type="danger" messages={this.props.getValidationMessages('password_repeat')} />
          </div>
          <button type="submit"
            className="signup-btn"
            disabled={(this.props.isValid() && !this.isLoading()) ? '' : 'disabled'}
            onClick={this.handleSubmit}>Signup</button>
          <p className="signup-help">Already have an account? <Link to="login">Login</Link></p>
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
