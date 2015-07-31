import React from 'react';

var Router = require('react-router')
  , Link = Router.Link;

export default class LocalLogin extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="col-sm-6 col-sm-offset-3">
          <h1><span className="fa fa-sign-in"></span> Login</h1>
          <div className="alert alert-danger">message</div>
          <form action="/auth/local-login" method="post">
              <div className="form-group">
                  <label>Email</label>
                  <input type="text" className="form-control" name="email"/>
              </div>
              <div className="form-group">
                  <label>Password</label>
                  <input type="password" className="form-control" name="password"/>
              </div>
              <button type="submit" className="btn btn-warning btn-lg">Login</button>
          </form>
          <hr/>
          <p>Need an account? <a href="/auth/signup">Signup</a></p>
          <p>Or go <a href="/">home</a>.</p>
      </div>
    );
  }
}
