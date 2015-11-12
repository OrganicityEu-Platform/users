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
            <p className="col-md-8 col-md-offset-2">Donec ullamcorper nulla non metus auctor fringilla. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Etiam porta sem malesuada magna mollis euismod. Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper. Nulla vitae elit libero, a pharetra augue.</p>
          </div>
        </div>
      </div>
    );
  }
});

export default HomeViewHeader;
