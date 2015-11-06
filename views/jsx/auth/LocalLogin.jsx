import $                   from 'jquery';
import React               from 'react';
import UserIsLoggedInMixin from '../UserIsLoggedInMixin.jsx'
import FlashQueue          from '../FlashQueue.jsx';
import LoadingMixin        from '../LoadingMixin.jsx';
import api                 from '../../../api_routes.js';
import ui                  from '../../../ui_routes.js';
import Login               from './Login.jsx';

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
  handleSubmit : function(evt) {
    evt.preventDefault();
    this.loading();
    $.ajax(api.reverse('local-login'), {
      error: (xhr, textStatus, errorThrown) => {
        this.loaded();
        if (xhr.status === 422) {
          this.state.error = 'Error logging in: username and/or password unknown';
          this.setState(this.state);
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
  },
  render : function() {

    var errorMessage;
    if (this.state.error) {
      errorMessage = (<Message type="danger" messages={this.state.error} />);
    }

    return (
      <div className="row oc-login-wrapper">
      <div className="col-sm-6 col-sm-offset-3">
        <div className="social-logins-wrapper">
          <Login/>
        </div>
          {errorMessage}
          <form action={api.reverse('local-login')} method="post">
            <div className="form-group">
                <input type="text"
                  className="form-control oc-login-email"
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
                  className="form-control oc-login-password"
                  placeholder="password"
                  name="password"
                  id="password"
                  disabled={this.isLoading() ? 'disabled' : ''}
                  value={this.state.password}
                  onChange={this.handleChangedPassword} />
            </div>
            <Message type="danger" messages={this.props.getValidationMessages('password')} />
            <button type="submit"
                    className="login-btn"
                    disabled={(this.props.isValid() && !this.isLoading()) ? '' : 'disabled'}
                    onClick={this.handleSubmit}>Login</button>
          </form>
          <p className="login-help">Need an account? <Link to="signup" >Signup</Link></p>
      </div>
      </div>
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
