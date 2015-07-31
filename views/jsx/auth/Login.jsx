import React from 'react';

var Router = require('react-router')
  , Link = Router.Link;

export default class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div class="jumbotron text-center">
        <h1><span className="fa fa-lock"></span> Login or Register</h1>
        <Link to="local-login" className="btn btn-default"><span className="fa fa-user"></span> Local Login</Link>
        <a href="/auth/signup" className="btn btn-default"><span className="fa fa-user"></span> Local Signup</a>
        <a href="/auth/facebook" className="btn btn-primary"><span className="fa fa-facebook"></span> Facebook</a>
        <a href="/auth/twitter" className="btn btn-info"><span className="fa fa-twitter"></span> Twitter</a>
        <a href="/auth/google" className="btn btn-danger"><span className="fa fa-google-plus"></span> Google+</a>
        <a href="/auth/github" className="btn btn-info"><span className="fa fa-github"></span> Github</a>
      </div>
    );
  }
}
