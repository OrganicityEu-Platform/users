import React from 'react';

var ScenarioTableView = React.createClass({
  render: function () {
    if (!this.props.scenario) {
      return null;
    }
    return (
      <table className="scenarioTableView">
        <tr>
          <th>Title</th>
          <td>{this.props.scenario.title}</td>
        </tr>
        <tr>
          <th>Summary</th>
          <td>{this.props.scenario.summary}</td>
        </tr>
        <tr>
          <th>Narrative</th>
          <td>{this.props.scenario.narrative}</td>
        </tr>
        <tr>
          <th>Actors</th>
          <td>{this.props.scenario.actors.join(", ")}</td>
        </tr>
        <tr>
          <th>Sectors</th>
          <td>{this.props.scenario.sectors.join(", ")}</td>
        </tr>
        <tr>
          <th>Devices</th>
          <td>{this.props.scenario.devices.join(", ")}</td>
        </tr>
      </table>
    )
  }
});

export default ScenarioTableView;
