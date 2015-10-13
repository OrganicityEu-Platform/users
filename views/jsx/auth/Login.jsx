import React from 'react';
import api   from '../../../api_routes.js';

var Router = require('react-router');
var Link = Router.Link;

var Login = React.createClass({
  render() {
    return (
      <div className="social-logins">
        <a href={api.reverse('auth_facebook')} className="">
          <span className="fa fa-facebook"></span>
        </a>
        <a href={api.reverse('auth_twitter')} className="">
          <span className="fa fa-twitter"></span>
        </a>
        <a href={api.reverse('auth_google')} className="">
          <span className="fa fa-google-plus"></span>
        </a>
        <a href={api.reverse('auth_github')} className="">
          <span className="fa fa-github"></span>
        </a>
        <a href={api.reverse('auth_disqus')} className="">
          <span className="">DISQUS</span>
        </a>
      </div>
    );
  }
});

export default Login;
