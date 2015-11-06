import $            from 'jquery';
import React        from 'react';
import FlashQueue   from '../FlashQueue.jsx';
import LoadingMixin from '../LoadingMixin.jsx';
import api          from '../../../api_routes.js';
import ui           from '../../../ui_routes.js';
import Login               from './Login.jsx';

// Input validation
import validation   from 'react-validation-mixin';
import strategy     from 'joi-validation-strategy';
import UserJoi      from '../../../models/joi/user.js';
import Message      from '../Message.jsx';

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
      error : null
    };
  },
  handleChangedEmail : function(evt) {
    this.state.email = evt.target.value;
    this.setState(this.state);
    this.props.validate();
  },
  handleChangedPassword : function(evt) {
    this.state.password = evt.target.value;
    this.setState(this.state);
    this.props.validate();
  },
  handleChangedPasswordRepeat : function(evt) {
    this.state.password_repeat = evt.target.value;
    this.setState(this.state);
    this.props.validate();
  },
  handleSubmit : function(evt) {
    evt.preventDefault();
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
  },
  render : function() {

    var errorMessage;
    if (this.state.error) {
      errorMessage = (<Message type="danger" messages={this.state.error} />);
    }

    return (
      <div className="row oc-signup-wrapper">
        <div className="col-sm-6 col-sm-offset-3">
          <div className="social-logins-wrapper">
            <Login/>
          </div>
          {errorMessage}
          <form action={api.reverse('signup')} method="post">
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
                    placeholder="password"
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
          </form>
          <p className="signup-help">Already have an account? <Link to="local-login">Login</Link></p>
        </div>
      </div>
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
