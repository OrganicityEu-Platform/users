import React                from 'react';
var Router = require('react-router');
var Link = Router.Link;

var HomeViewHeader = React.createClass({
  render: function() {
    return (
      <div>
        <div className="oc-home-view-header-wrapper">
          <div className="oc-home-view-header container">
            <h1 className="oc-home-view-title">Welcome to OrganiCity Scenarios</h1>
            <p className="col-md-8 col-md-offset-2">The scenario tool is made for making ideas come to life, and foster co-creation among citizens. The tool presents a broad range of different scenarios (prose based stories), which you can browse and evaluate. If you register as a user, you will be able to create your own scenario as well as comment and discuss existing ones.</p>
          </div>
        </div>
      </div>
    );
  }
});

export default HomeViewHeader;
