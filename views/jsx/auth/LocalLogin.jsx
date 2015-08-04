import $ from 'jquery';
import React from 'react';
import UserIsLoggedInMixin from '../UserIsLoggedInMixin.jsx'
import api from '../../../api_routes.js';
import ui  from '../../../ui_routes.js';

var Router = require('react-router')
  , Link = Router.Link;

var LocalLogin = React.createClass({
  mixins: [UserIsLoggedInMixin],
  getInitialState : function() {
    return {
      email : '',
      password : ''
    };
  },
  isValid : function() {
    // TODO improve validation
    return (
      this.state.email != '' &&
      this.state.email !== undefined &&
      this.state.password !== undefined &&
      this.state.password != ''
    );
  },
  handleChangedEmail : function(evt) {
    this.state.email = evt.target.value;
    this.setState(this.state);
  },
  handleChangedPassword : function(evt) {
    this.state.password = evt.target.value;
    this.setState(this.state);
  },
  /*
  handleLogin : function(evt) {
    evt.preventDefault();
    $.ajax(api.route('local-login'), {
      dataType : 'json',
      data : this.state,
      error: console.log,
      success : function(data) {
        this.transitionTo('home');
      }
    });
  },
  */
  render : function() {
    return (
      <div className="col-sm-6 col-sm-offset-3">
          <h1><span className="fa fa-sign-in"></span> Login</h1>
          <div className="alert alert-danger">message: bla</div>
          <form action={api.route('local-login')} method="post">
            <div className="form-group">
                <label>Email</label>
                <input type="text" className="form-control" name="email" id="email" value={this.state.email} onChange={this.handleChangedEmail} />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input type="password" className="form-control" name="password" id="password" value={this.state.password} onChange={this.handleChangedPassword} />
            </div>
            <button type="submit"
                    className="btn btn-warning btn-lg"
                    disabled={this.isValid() ? '' : 'disabled'}>Login</button>
          </form>
          <hr/>
          <p>Need an account? <Link to="signup" >Signup</Link></p>
      </div>
    );
  }
});

export default LocalLogin;
