import React  from 'react';
import ui     from '../../ui_routes.js';

var Router = require('react-router');
var Link = Router.Link;

var facebook = "https://www.facebook.com/thealexandrainstitute";
var twitter = "https://twitter.com/AlexandraInst";
var linkedin = "https://www.linkedin.com/company/alexandra-instituttet";
var flickr = "https://www.flickr.com/photos/alexandra_instituttet/";
var slideshare = "http://www.slideshare.net/AlexandraInstituttet";
var youtube = "https://www.youtube.com/user/alexandrainstituttet";

var FooterLarge = React.createClass({
  render: function() {
    return (
        <div className="row oc-footer-large">
          <span className="oc-footer-large-follow-link">Follow us</span>
          <div className="oc-footer-large-social-links">
            <a href={facebook}><span className="fa fa-facebook-official"></span></a>
            <a href={twitter}><span className="fa fa-twitter"></span></a>
            <a href={linkedin}><span className="fa fa-linkedin-square"></span></a>
            <a href={slideshare}><span className="fa fa-slideshare"></span></a>
            <a href={flickr}><span className="fa fa-flickr"></span></a>
            <a href={youtube}><span className="fa fa-youtube-play"></span></a>
          </div>
          <img className="oc-footer-large-eu-logo" src={ui.asset('static/img/logo_eu.png')} />
        </div>
    );
  }
});

export default FooterLarge;
