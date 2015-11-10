import React from 'react';
import ContactUs from './ContactUs.jsx';

var Router = require('react-router');
var Link = Router.Link;

const organicityLink = "http://organicity.eu/";

var FooterSmall = React.createClass({
  render: function() {
    return (
        <div className="row oc-footer-small">
          <div className="col-md-2">&copy; OrganiCity 2015</div>
          <div className="col-md-1" />
          <div className="col-md-4">
            <a className="oc-link" href={organicityLink}>
              VISIT ORGANICITY.EU TO FIND OUT MORE
            </a>
          </div>
          <div className="col-md-5">
            <ContactUs currentUser={this.props.currentUser} />
          </div>
        </div>
    );
  }
});

export default FooterSmall;
