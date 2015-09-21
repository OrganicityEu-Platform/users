import React                from 'react';

var Router = require('react-router');
var Link = Router.Link;

var OcFooter = React.createClass({
  render: function() {
    return (
      <div className="oc-footer">
        <span className="oc-footer-follow">Follow us</span>  
      </div>
    );
  }
});

export default OcFooter;
