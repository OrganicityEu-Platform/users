import React from 'react';

var Router = require('react-router')
  , Link = Router.Link;

var Login = React.createClass({
  render() {
    return (
      <div className="jumbotron text-center">
        <h1><span className="fa fa-lock"></span> Login or Register</h1>
        <Link to="local-login" className="btn btn-default"><span className="fa fa-user"></span> Local Login</Link>
        <a href="/api/v1/auth/signup" className="btn btn-default"><span className="fa fa-user"></span> Local Signup</a>
        <a href="/api/v1/auth/facebook" className="btn btn-primary"><span className="fa fa-facebook"></span> Facebook</a>
        <a href="/api/v1/auth/twitter" className="btn btn-info"><span className="fa fa-twitter"></span> Twitter</a>
        <a href="/api/v1/auth/google" className="btn btn-danger"><span className="fa fa-google-plus"></span> Google+</a>
        <a href="/api/v1/auth/github" className="btn btn-info"><span className="fa fa-github"></span> Github</a>
      </div>
    );
  }
});

export default Login;
