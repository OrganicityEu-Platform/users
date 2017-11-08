import React from 'react';
import Router from 'react-router';

import HomeViewHeader from './HomeViewHeader.jsx';
import HomeViewSection from './HomeViewSection.jsx';
import HomeViewFooter from './HomeViewFooter.jsx';

import config             from '../../config/config.js';
import DocumentTitle      from 'react-document-title';

import ScenariosCanvas from './ScenariosCanvas.jsx'
import ScenarioEco  from './scenarios/ScenarioEco.jsx';

var HomeView = React.createClass({
  mixins: [Router.Navigation],
  componentDidMount: function() {
    this.transitionTo('profile');
  },
  render : function() {
    return (<div></div>);
    /*
    return (
      <div>
        <DocumentTitle title={config.title} />
        <div className="row">
          <HomeViewHeader />
        </div>
      </div>
    );
    */
  }
});

export default HomeView;
