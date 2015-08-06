import React from 'react';
import ScenarioEditButton from './ScenarioEditButton.jsx';
import ScenarioDeleteButton from './ScenarioDeleteButton.jsx';

var Router = require('react-router')
  , Link = Router.Link;

var ScenarioListItem = React.createClass({
  render: function () {
    return (
      <tr>
        <td className="scenarioListItemTitle">
          <Link to="scenarioView" params={{ uuid: this.props.scenario.uuid }}>{this.props.scenario.title}</Link>
        </td>
        <td className="scenarioListItemSummary">
          { this.props.scenario.summary ? this.props.scenario.summary.replace(/(?:\r\n|\r|\n)/g, '<br>') : '' }
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
