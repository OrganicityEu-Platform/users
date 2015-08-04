import React from 'react';
import $ from 'jquery';
import ScenarioListItem from './ScenarioListItem.jsx';

var ScenarioList = React.createClass({
  getInitialState: function () {
    return {
      scenarios: []
    };
  },
  componentDidMount: function () {
    $.getJSON('/api/v1/scenarios', function (result) {
      if (this.isMounted()) {
        this.setState({
          scenarios: result
        });
      }
    }.bind(this));
  },
  render: function () {
    return (
      <div className="scenarioList">
        <table className="scenarioListTable">
          <thead>
            <tr>
              <th>Title</th>
              <th>Narrative</th>
              <th>Creator</th>
              <th>Created</th>
              <th>Edited</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              if (this.state.scenarios.length == 0) {
                return (
                  <tr>
                    <td colSpan="7">No scenarios found....</td>
                  </tr>
                )
              }
            })()}
            {
              this.state.scenarios.map((scenario) => <ScenarioListItem key={scenario.sid} scenario={scenario}/>)
            }
          </tbody>
        </table>
      </div>
    );
  }
});

export default ScenarioList;
