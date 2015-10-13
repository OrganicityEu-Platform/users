import React  from 'react';
import ui     from '../../ui_routes.js';

var Router = require('react-router');
var Link = Router.Link;

var facebook = "https://www.facebook.com/thealexandrainstitute"; // fa fa-facebook-official
var twitter = "https://twitter.com/AlexandraInst";
var linkedin = "https://www.linkedin.com/company/alexandra-instituttet"; // fa fa-linkedin-square
var flickr = "https://www.flickr.com/photos/alexandra_instituttet/"; // fa fa-flickr
var slideshare = "http://www.slideshare.net/AlexandraInstituttet"; // fa fa-slideshare
var youtube = "https://www.youtube.com/user/alexandrainstituttet"; // fa fa-youtube-play

var FooterLarge = React.createClass({
  render: function() {
    return (
        <div className="row oc-footer-large">
          <span className="oc-footer-large-follow-link">Follow us</span>
          <div className="oc-footer-large-social-links">
            <a href={twitter}><span className="fa fa-twitter"></span></a>
          </div>
          <img className="oc-footer-large-eu-logo" src={ui.asset('static/img/logo_eu.png')} />
        </div>
    );
  }
});

export default FooterLarge;
