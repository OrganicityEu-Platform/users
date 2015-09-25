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
      errorMessage = (<ErrorMessage messages={this.state.error} />);
    }

    return (
      <div className="col-sm-6 col-sm-offset-3">
          <h1><span className="fa fa-sign-in"></span> Login</h1>
          {errorMessage}
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

