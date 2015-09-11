import $                   from 'jquery';
import React               from 'react';
import UserIsLoggedInMixin from '../UserIsLoggedInMixin.jsx'
import FlashQueue          from '../FlashQueue.jsx';
import LoadingMixin        from '../LoadingMixin.jsx';
import api                 from '../../../api_routes.js';
import ui                  from '../../../ui_routes.js';

// Input validation
import validation   from 'react-validation-mixin';
import strategy     from 'joi-validation-strategy';
import UserJoi      from '../../../models/joi/user.js';
import ErrorMessage from '../ErrorMessage.jsx';

var Router = require('react-router');
var Link = Router.Link;
var Navigation = Router.Navigation;

var LocalLogin = React.createClass({
  mixins: [Navigation, UserIsLoggedInMixin, FlashQueue.Mixin, LoadingMixin],
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
    var self = this;
    this.loading();
    $.ajax(api.reverse('local-login'), {
      error: (jqXHR, textStatus, errorThrown) => {
        this.loaded();
        if (jqXHR.status === 422) {
          self.state.error = 'Error logging in: username and/or password unknown';
          self.setState(this.state);
        } else {
          self.flashOnAjaxError(jqXHR, textStatus, errorThrown);
        }
      },
      success: (currentUser) => {
        this.loaded();
        self.props.onLogin(currentUser);
        self.transitionTo(ui.reverse('profile'));
      },
      method: 'POST',
      data: {
        email: self.state.email,
        password: self.state.password
      }
    });
  },
  render : function() {
    return (
      <div className="col-sm-6 col-sm-offset-3">
          <h1><span className="fa fa-sign-in"></span> Login</h1>
          {(() => {
            if (this.state.error) {
              return (<div className="alert alert-warning">{this.state.error}</div>);
            }
          })()}
          <form action={api.reverse('local-login')} method="post">
            <div className="form-group">
                <label>Email</label>
                <input type="text"
                  className="form-control"
                  name="email"
                  id="email"
                  disabled={this.isLoading() ? 'disabled' : ''}
                  value={this.state.email}
                  onChange={this.handleChangedEmail} />
            </div>
            <ErrorMessage messages={this.props.getValidationMessages('email')} />
            <div className="form-group">
                <label>Password</label>
                <input type="password"
                  className="form-control"
                  name="password"
                  id="password"
                  disabled={this.isLoading() ? 'disabled' : ''}
                  value={this.state.password}
                  onChange={this.handleChangedPassword} />
            </div>
            <ErrorMessage messages={this.props.getValidationMessages('password')} />
            <button type="submit"
                    className="btn btn-warning btn-lg"
                    disabled={(this.props.isValid() && !this.isLoading()) ? '' : 'disabled'}
                    onClick={this.handleSubmit}>Login</button>
          </form>
          <hr/>
          <p>Need an account? <Link to="signup" >Signup</Link></p>
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

