import React  from 'react';
import api    from '../../../api_routes.js';
import login  from '../../../config/login.js';

var Router = require('react-router');
var Link = Router.Link;

var SocialmediaLogin = React.createClass({
  render() {

    var facebook = null;
    if(login.facebook) {
      facebook = (
        <a href={api.reverse('auth_facebook')} className="">
          <span className="fa fa-facebook"></span>
        </a>
      );
    }

    var oauth2 = null;
    if(login.oauth2) {
      oauth2 = (
        <a href={api.reverse('auth_oauth2')} className="">
          <span className="fa fa-sign-in"></span>
        </a>
      );
    }

    var twitter = null;
    if(login.twitter) {
      twitter = (
        <a href={api.reverse('auth_twitter')} className="">
          <span className="fa fa-twitter"></span>
        </a>
      );
    };

    var google = null;
    if(login.google) {
      google = (
        <a href={api.reverse('auth_google')} className="">
          <span className="fa fa-google-plus"></span>
        </a>
      );
    };

    var github = null;
    if(login.github) {
      github = (
        <a href={api.reverse('auth_github')} className="">
          <span className="fa fa-github"></span>
        </a>
      );
    };

    var disqus = null;
    if(login.disqus) {
      disqus = (
       <a href={api.reverse('auth_disqus')} className="">
          <span className="">DISQUS</span>
        </a>
      );
    };

    return (
      <div className="social-logins">
        {oauth2}
        {facebook}
        {twitter}
        {google}
        {github}
        {disqus}
      </div>

    );
  }
});

export default SocialmediaLogin;
