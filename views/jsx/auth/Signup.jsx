import React from 'react';

var Router = require('react-router')
  , Link = Router.Link;

export default class Signup extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="col-sm-6 col-sm-offset-3">
        <h1><span className="fa fa-sign-in"></span> Signup</h1>
        <div className="alert alert-danger">message</div>
        <form action="/api/v1/auth/signup" method="post">
            <div className="form-group">
                <label>Email</label>
                <input type="text" className="form-control" name="email"/>
            </div>
            <div className="form-group">
                <label>Password</label>
                <input type="password" className="form-control" name="password"/>
            </div>
            <button type="submit" className="btn btn-warning btn-lg">Signup</button>
        </form>
        <hr/>
        <p>Already have an account? <a href="/api/v1/auth/login">Login</a></p>
        <p>Or go <a href="/">home</a>.</p>
      </div>
    );
  }
}
