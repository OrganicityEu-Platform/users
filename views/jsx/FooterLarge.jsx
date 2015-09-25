import React                from 'react';

var Router = require('react-router');
var Link = Router.Link;

var FooterLarge = React.createClass({
  render: function() {
    return (
        <div className="row oc-footer-large">
          <span className="oc-footer-large-follow-link">Follow us</span>
          <div className="oc-footer-large-social-links">
            <span>facebook</span>
            <span>twitter</span>
            <span>linkedIn</span>
            <span>youtube</span>
          </div>
          <img className="oc-footer-large-eu-logo" src={"/organicity-scenario-tool/static/img/logo_eu.png"} />
        </div>
    );
  }
});

export default FooterLarge;
