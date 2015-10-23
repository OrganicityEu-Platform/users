import React                from 'react';

var Router = require('react-router');
var Link = Router.Link;

var organicityLink = "http://organicity.eu/";

var FooterSmall = React.createClass({
  render: function() {
    return (
        <div className="row oc-footer-small">
          <div className="col-md-3">&copy; OrganiCity 2015</div>
          <div className="col-md-6"><a className="oc-link" href={organicityLink}>VISIT ORGANICITY.EU TO FIND OUT MORE</a></div>
          <div className="col-md-3">Contact us</div>
        </div>
    );
  }
});

export default FooterSmall;
