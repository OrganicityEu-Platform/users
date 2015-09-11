import $            from 'jquery';
import React        from 'react';
import FlashQueue   from '../FlashQueue.jsx';
import LoadingMixin from '../LoadingMixin.jsx';
import api          from '../../../api_routes.js';
import ui           from '../../../ui_routes.js';

// Input validation
import validation   from 'react-validation-mixin';
import strategy     from 'joi-validation-strategy';
import UserJoi      from '../../../models/joi/user.js';
import ErrorMessage from '../ErrorMessage.jsx';

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
      var self = this;
      var url = api.reverse('signup');
      $.ajax(url, {
        error: (jqXHR, textStatus, errorThrown) => {
          this.loaded();
          if (jqXHR.status === 500) {
            self.flashOnAjaxError(url, 'Error signing up')(jqXHR, textStatus, errorThrown);
          } else {
            self.state.error = 'Error signing up: ' + textStatus;
            self.setState(this.state);
          }
        },
        success: (currentUser) => {
          this.loaded();
          self.props.onLogin(currentUser);
          self.transitionTo(ui.route('profile'));
        },
        method: 'POST',
        data: {
          email: self.state.email,
          password: self.state.password
        }
      });
    }
  },
  render : function() {
    return (
      <div className="col-sm-6 col-sm-offset-3">
        <h1><span className="fa fa-sign-in"></span> Signup</h1>
        {(() => {
          if (this.state.error) {
            return (<div className="alert alert-warning">{this.state.error}</div>);
          }
        })()}
        <form action={api.reverse('signup')} method="post">
            <div className="form-group">
                <label htmlFor="email">E-Mail</label>
                <input type="text"
                  className="form-control"
                  name="email"
                  value={this.state.email}
                  disabled={this.isLoading() ? 'disabled' : ''}
                  onChange={this.handleChangedEmail} />
                <ErrorMessage messages={this.props.getValidationMessages('email')} />
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password"
                  className="form-control"
                  name="password"
                  value={this.state.password}
                  disabled={this.isLoading() ? 'disabled' : ''}
                  onChange={this.handleChangedPassword} />
                <ErrorMessage messages={this.props.getValidationMessages('password')} />
            </div>
            <div className="form-group">
                <label htmlFor="password_repeat">Repeat Password</label>
                <input type="password"
                  className="form-control"
                  name="password_repeat"
                  disabled={this.isLoading() ? 'disabled' : ''}
                  value={this.state.password_repeat}
                  onChange={this.handleChangedPasswordRepeat} />
                <ErrorMessage messages={this.props.getValidationMessages('password_repeat')} />
            </div>
            <button type="submit"
              className="btn btn-warning btn-lg"
              disabled={(this.props.isValid() && !this.isLoading()) ? '' : 'disabled'}
              onClick={this.handleSubmit}>Signup</button>
        </form>
        <hr/>
        <p>Already have an account? <Link to="local-login">Login</Link></p>
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
