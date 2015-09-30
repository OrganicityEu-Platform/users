import $                    from 'jquery';
import React                from 'react';
import Router               from 'react-router';
import ReactDisqusThread    from 'react-disqus-thread';

import ScenarioTableView    from './ScenarioTableView.jsx';
import ScenarioEditButton   from './ScenarioEditButton.jsx';
import ScenarioDeleteButton from './ScenarioDeleteButton.jsx';
import api                  from '../../../api_routes.js';

var ScenarioView = React.createClass({
  mixins: [Router.Navigation],
  getInitialState: function() {
    return null;
  },
  componentDidMount: function() {
    var url = api.reverse('scenario_by_uuid', { uuid : this.props.params.uuid });
    $.getJSON(url, (scenario) => {
      if (this.isMounted()) {
        this.setState(scenario);
      }
    });
  },
  clickedEvaluate: function() {
    this.transitionTo('scenarioEvalView', { uuid : this.props.params.uuid }, { version : this.state.version });
  },
  render: function() {
    if (this.state === null) {
      return null;
    }
    return (
      <div>
        <div className="row">
          <ScenarioTableView scenario={this.state} />
        </div>
        <div className="row">
          <div className="oc-scenario-controls">
            <button type="button" className="btn btn-default" onClick={this.clickedEvaluate}>EVALUATE</button>
            <ScenarioEditButton scenario={this.state}/>
            <ScenarioDeleteButton scenario={this.state}/>
          </div>
        </div>
        <div className="row">
          <div className="oc-disqus-wrapper">
            <ReactDisqusThread categoryId="3957189" shortname="organicity" identifier={this.state.uuid} title={this.state.title}/>
          </div>
        </div>
      </div>
    );
  }
});

export default ScenarioView;
