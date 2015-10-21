import React from 'react';

var Router = require('react-router');
var Link = Router.Link;

var FooterSmall = React.createClass({
  render: function() {
    return (
        <div className="row oc-footer-small">
          <div className="col-md-3">&copy; OrganiCity 2015</div>
          <div className="col-md-6">VISIT ORGANICITY.ORG TO FIND OUT MORE</div>
          <div className="col-md-3">
            <Link to="contactUs">
              Contact Us
            </Link>
          </div>
        </div>
    );
  }
});

export default FooterSmall;
