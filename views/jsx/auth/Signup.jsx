import React from 'react';

var Router = require('react-router')
  , Link = Router.Link;

var Signup = React.createClass({
  getInitialState : function() {
    return {};
  },
  isValid : function() {
    // TODO improve validation
    return (
      this.state.email != '' &&
      this.state.email !== undefined &&
      this.state.password !== undefined &&
      this.state.password != '' &&
      this.state.password == this.state.password_repeat
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
  handleChangedPasswordRepeat : function(evt) {
    this.state.password_repeat = evt.target.value;
    this.setState(this.state);
  },
  handleSubmit : function(evt) {
    evt.preventDefault();
  },
  render : function() {
    return (
      <div className="col-sm-6 col-sm-offset-3">
        <h1><span className="fa fa-sign-in"></span> Signup</h1>
        <div className="alert alert-danger">message</div>
        <form action="/api/v1/auth/signup" method="post">
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="text" className="form-control" name="email" onChange={this.handleChangedEmail} />
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" className="form-control" name="password" onChange={this.handleChangedPassword} />
            </div>
            <div className="form-group">
                <label htmlFor="password-repeat">Repeat Password</label>
                <input type="password" className="form-control" name="password-repeat" onChange={this.handleChangedPasswordRepeat} />
            </div>
            <button type="submit"
                    className="btn btn-warning btn-lg"
                    disabled={this.isValid() ? '' : 'disabled'}>Signup</button>
        </form>
        <hr/>
        <p>Already have an account? <Link to="local-login">Login</Link></p>
      </div>
    );
  }
});

export default Signup;
