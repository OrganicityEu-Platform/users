import React  from 'react';

import UserIsLoggedInMixin  from './UserIsLoggedInMixin.jsx';
import I18nMixin            from './i18n/I18nMixin.jsx';

var Router = require('react-router');
var Link = Router.Link;

var HomeViewHeader = React.createClass({
  mixins : [UserIsLoggedInMixin, I18nMixin],
  render: function() {

    if(this.userIsLoggedIn()){
      return(
        <div>
          <div className="oc-home-view-header-wrapper">
            <div className="oc-home-view-header container">
              <h2
                className="col-md-8 col-md-offset-2">
                <p className="oc-home-view-header-sub-text">
                  <span className="first-letter-uppercase">{this.i18n('explore_share_discuss', 'explore, share and discuss')}</span>
                  <span className="pink oc-bold">{this.i18n('scenarios_future_cities', 'scenarios for our future cities')}</span>
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
                <span className="first-letter-uppercase">{this.i18n('join_community', 'join the community to')}</span>
                <span>{this.i18n('explore_share_discuss', 'explore, share and discuss')}</span>
                <span className="pink oc-bold">{this.i18n('scenarios_future_cities', 'scenarios for our future cities')}</span>
              </p>
              </h2>
          </div>
        </div>
      </div>
    );
  }
});

export default HomeViewHeader;
