import React              from 'react';
import { Button }         from 'react-bootstrap';
import ScenariosNewest    from './scenarios/ScenariosNewest.jsx';

var Router = require('react-router');
var Link = Router.Link;

var HomeViewSection = React.createClass({
  mixins: [Router.Navigation],
  clickHander: function() {
    this.transitionTo('scenarioList');
  },
  render: function() {
    return (
      <div>
        <div className="oc-home-view-section-wrapper">
          <div className="oc-home-view-section container">
            <div className="oc-home-view-title-wrapper">
              <h1 className="oc-home-view-title">Latest scenarios</h1>
              <ScenariosNewest limit="8"/>
            </div>
            <div id="oc-home-view-section-explore-all-scenarios-btn-wrapper">
              <div className="col-md-4"></div>
              <div className="col-md-4">
                <Button id="oc-home-view-section-explore-all-scenarios-btn" onClick={this.clickHander}>EXPLORE ALL SCENARIOS</Button>
              </div>
              <div className="col-md-4"></div>
            </div>
          </div>
        </div>
      </div>

    );
  }
});

export default HomeViewSection;
