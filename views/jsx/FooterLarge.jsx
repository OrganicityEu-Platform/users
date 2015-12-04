import React      from 'react';
import ui         from '../../ui_routes.js';
import ContactUs  from './ContactUs.jsx';

var Router = require('react-router');
var Link = Router.Link;

var facebook = "https://www.facebook.com/OrganiCities"; // fa fa-facebook-official
var twitter = "https://twitter.com/organicity_eu";
var linkedin = "https://www.linkedin.com/company/alexandra-instituttet"; // fa fa-linkedin-square
var flickr = "https://www.flickr.com/photos/alexandra_instituttet/"; // fa fa-flickr
var slideshare = "http://www.slideshare.net/AlexandraInstituttet"; // fa fa-slideshare
var youtube = "https://www.youtube.com/user/alexandrainstituttet"; // fa fa-youtube-play

var FooterLarge = React.createClass({
  render: function() {
    return (
      <div className="row oc-footer-large">
        <div className="col-lg-8 col-lg-offset-2">
          <div className="col-lg-3 white oc-footer-col">
            <p className="oc-footer-title">Follow us</p>
            <span className="oc-social-links-wrapper">
              <a href={twitter}>
                <i className="fa fa-twitter oc-footer-social-link"></i>
              </a>
              <a href={facebook}>
                <i className="fa fa-facebook-official oc-footer-social-link"></i>
              </a>
            </span>
            <div className="oc-footer-large-eu-logo-wrapper">
              <img
                className="oc-footer-large-eu-logo"
                src={ui.asset('static/img/logo_eu.png')} />
            </div>
            <span className="oc-logo-text">
              This project has recieved funding from the European Union's Horizon 2020 research and innovation program under the grant agreement No. 645198.
            </span>

          </div>
          <div className="col-lg-4 white oc-footer-col">
            <p className="oc-footer-title">Resouces</p>
            <span>OrganiCity.eu</span>
            <span>Partners</span>
            <span>
              Site map
            </span>
            <span>
              Privacy policy
            </span>
            <span>Press</span>
            <span>Blog</span>
            <span>
              Sign up for updates
            </span>
          </div>
          <div className="col-lg-5 white oc-footer-col" id="oc-footer-contact-col">
            <p className="oc-footer-title">
              Contact us
            </p>
            <ContactUs currentUser={this.props.currentUser} />
          </div>
        </div>
        <div className="col-lg-12 white">
          <span>Copyright <i className="fa fa-copyright"></i> OrganiCity 2015</span>
        </div>
      </div>
    );
  }
});

export default FooterLarge;
