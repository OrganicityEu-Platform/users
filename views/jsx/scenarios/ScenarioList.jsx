import React from 'react';
import $ from 'jquery';
import ScenarioListItem from './ScenarioListItem.jsx';

var ScenarioList = React.createClass({
  getInitialState: function () {
    return null;
  },
  componentDidMount: function () {
    this.reload();
  },
  reload: function() {
    $.getJSON('/api/v1/scenarios', (scenarios) => {
      if (this.isMounted()) {
        this.setState({
          scenarios: scenarios
        });
      }
    });
  },
  render: function () {
    if (this.state == null) {
      return null;
    }
    return (
      <div className="scenarioList">
        <table className="scenarioListTable">
          <thead>
            <tr>
              <th>Title</th>
              <th>Summary</th>
              <th>Last Updated</th>
              <th>Creator</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              if (this.state.scenarios.length == 0) {
                return (
                  <tr>
                    <td colSpan="5">No scenarios found....</td>
                  </tr>
                )
              }
            })()}
            {
              this.state.scenarios.map((scenario) => <ScenarioListItem key={scenario.uuid} scenario={scenario} onChange={this.reload}/>)
            }
          </tbody>
        </table>
      </div>
    );
  }
});

export default ScenarioList;
