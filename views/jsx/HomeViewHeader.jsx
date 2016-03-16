import React  from 'react';

import UserIsLoggedInMixin  from './UserIsLoggedInMixin.jsx';

var Router = require('react-router');
var Link = Router.Link;

var HomeViewHeader = React.createClass({
  mixins : [UserIsLoggedInMixin],
  render: function() {

    if(this.userIsLoggedIn()){
      return(
        <div>
          <div className="oc-home-view-header-wrapper">
            <div className="oc-home-view-header container">
              <h2
                className="col-md-8 col-md-offset-2">
                <p className="oc-home-view-header-sub-text">
                  <span>Explore, share and discuss</span>
                  <span className="pink oc-bold">scenarios for our future cities</span>
                  </p>
                  </h2>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className="oc-home-view-header-wrapper">
          <div className="oc-home-view-header container">
            <h2
              className="col-md-8 col-md-offset-2">
              <p className="oc-home-view-header-sub-text">
                <span>Join the community to</span>
                <span>explore, share and discuss</span>
                <span className="pink oc-bold">scenarios for our future cities</span>
              </p>
              </h2>
          </div>
        </div>
      </div>
    );
  }
});

export default HomeViewHeader;
