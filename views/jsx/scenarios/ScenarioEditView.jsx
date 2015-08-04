import React from 'react';
import ScenarioTableView from './ScenarioTableView.jsx';

var ScenarioEditView = React.createClass({
  getInitialState: function () {
    return null;
  },
  componentDidMount: function () {
    $.getJSON('/api/v1/scenarios/' + this.props.scenarioId, (scenario) => {
      if (this.isMounted()) {
        this.setState(scenario);
      }
    });
  },
  render: function () {
    if (this.state === null) {
      return null;
    }
    return (
      <div>
        <div class="row">
          <ScenarioTableView scenario={this.state} />
        </div>
      </div>
    )
  }
});

export default ScenarioEditView;
