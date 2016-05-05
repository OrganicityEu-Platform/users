import React                        from 'react';
import { Button, Accordion, Panel } from 'react-bootstrap';
import ScenariosNewest              from './scenarios/ScenariosNewest.jsx';
import I18nMixin                    from './i18n/I18nMixin.jsx';

var Router = require('react-router');
var Link = Router.Link;

var HomeViewFooter = React.createClass({
  mixins: [Router.Navigation, I18nMixin],
  render: function() {
    return (
      <div className="col-lg-8 col-lg-offset-2 oc-home-view-footer-wrapper">
          <div className="oc-home-view-footer">
            <ScenariosNewest limit="6" counter={false}/>
          </div>
          <div id="oc-home-view-footer-explore-btn-wrapper">
            <Link to="scenarioList">
              <Button className="oc-button all-uppercase">{this.i18n('explore_all_scenarios', 'EXPLORE ALL SCENARIOS')}</Button>
            </Link>
          </div>
      </div>

    );
  }
});

export default HomeViewFooter;
