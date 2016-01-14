import React                from 'react';
var Router = require('react-router');
var Link = Router.Link;

var HomeViewHeader = React.createClass({
  render: function() {
    return (
      <div>
        <div className="oc-home-view-header-wrapper">
          <div className="oc-home-view-header container">
            <h1 className="oc-home-view-header-text">Welcome to OrganiCity Scenarios</h1>
            <h2 className="col-md-8 col-md-offset-2 oc-home-view-header-sub-text">Co-creating smart cities of the future</h2>
          </div>
        </div>
      </div>
    );
  }
});

export default HomeViewHeader;
