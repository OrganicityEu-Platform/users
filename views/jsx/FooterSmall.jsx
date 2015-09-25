import React                from 'react';

var Router = require('react-router');
var Link = Router.Link;

var FooterSmall = React.createClass({
  render: function() {
    return (
        <div className="row oc-footer-small">
          <div className="col-md-4">@ OrganiCity 2015</div>
          <div className="col-md-4">VISIT ORGANICITY.ORG TO FIND OUT MORE</div>
          <div className="col-md-4">Contact us</div>
        </div>
    );
  }
});

export default FooterSmall;
