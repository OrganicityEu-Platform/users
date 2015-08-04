import React from 'react';
import ScenarioEditButton from './ScenarioEditButton.jsx';
import ScenarioDeleteButton from './ScenarioDeleteButton.jsx';

var ScenarioListItem = React.createClass({
  render: function () {
    console.log(this.props);
    return (
      <tr>
        <td className="scenarioListItemTitle">
          <a href={"/scenarios/"+this.props.scenario.sid}>{this.props.scenario.title}</a>
        </td>
        <td className="scenarioListItemSummary">
          { this.props.scenario.summary ? this.props.scenario.summary.replace(/(?:\r\n|\r|\n)/g, '<br>') : '' }
        </td>
        <td className="scenarioListItemOwner">
          <a href={"/users/"+this.props.scenario.creator}>{this.props.scenario.creator}</a>
        </td>
        <td className="scenarioListItemTimestamp">
            { this.props.scenario.timestamp ?
                  <time className="timeago" dateTime={(new Date(this.props.scenario.timestamp)).toISOString()}>{(new Date(this.props.scenario.timestamp)).toISOString()}</time> :
                  ''
            }
        </td>
        <td><ScenarioEditButton scenario={this.props.scenario}/></td>
        <td><ScenarioDeleteButton scenario={this.props.scenario}/></td>
      </tr>
    )
  }
});

export default ScenarioListItem;
