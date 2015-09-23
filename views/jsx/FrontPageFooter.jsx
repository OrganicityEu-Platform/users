import React                from 'react';

var Router = require('react-router');
var Link = Router.Link;

var FrontPageFooter = React.createClass({
  render: function() {
    return (
        <div className="row oc-front-page-footer">
          <div className="col-md-4">Contact us</div>
          <div className="col-md-4">VISIT ORGANICITY.ORG TO FIND OUT MORE</div>
          <div className="col-md-4">@ OrganiCity 2015</div>
        </div>
    );
  }
});

export default FrontPageFooter;
