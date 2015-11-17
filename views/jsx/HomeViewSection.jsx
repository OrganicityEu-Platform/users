import React              from 'react';
import { Button }         from 'react-bootstrap';
import ScenariosNewest    from './scenarios/ScenariosNewest.jsx';

var Router = require('react-router');
var Link = Router.Link;

var HomeViewSection = React.createClass({
  mixins: [Router.Navigation],
  render: function() {
    return (
      <div>
        <div className="oc-home-view-section-wrapper col-lg-8 col-lg-offset-2">
          <div className="oc-home-view-section">
            <h1 className="oc-home-view-title">Latest scenarios</h1>
            <ScenariosNewest limit="9" counter={false}/>
            <div className="col-md-4 col-md-offset-4 oc-home-scenarioList">
              <Link to="scenarioList">
                <Button className="oc-button">EXPLORE ALL SCENARIOS</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

    );
  }
});

export default HomeViewSection;
