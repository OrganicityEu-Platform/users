import React                from 'react';

var Router = require('react-router');
var Link = Router.Link;

var GlobalFooter = React.createClass({
  render: function() {
    return (
        <div className="row oc-global-footer">
          <span className="oc-global-footer-follow-link">Follow us</span>
          <div className="oc-global-footer-social-links">
            <span>facebook</span>
            <span>twitter</span>
            <span>linkedIn</span>
            <span>youtube</span>
          </div>
            <img className="oc-global-footer-eu-logo" src={"/organicity-scenario-tool/static/img/logo_eu.png"} />
        </div>
    );
  }
});

export default GlobalFooter;
