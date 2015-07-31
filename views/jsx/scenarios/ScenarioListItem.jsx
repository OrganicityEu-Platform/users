import React from 'react';
import RoleRequiredMixin from '../RoleRequiredMixin.jsx';
import ScenarioEditButton from './ScenarioEditButton.jsx';
import ScenarioDeleteButton from './ScenarioDeleteButton.jsx';

var ScenarioListItem = React.createClass({
  mixins: [RoleRequiredMixin],
  render: function () {
    return (
      <tr>
        <td className="scenarioListItemTitle">
          <a href={"/scenarios/"+this.props.data.sid}>{this.props.data.title}</a>
        </td>
        <td className="scenarioListItemSummary">
          { this.props.data.summary ? this.props.data.summary.replace(/(?:\r\n|\r|\n)/g, '<br>') : '' }
        </td>
        <td className="scenarioListItemOwner">
          <a href={"/users/"+this.props.data.creator}>{this.props.data.creator}</a>
        </td>
        <td className="scenarioListItemTimestamp">
            { this.props.data.timestamp ?
                  <time className="timeago" dateTime={(new Date(this.props.data.timestamp)).toISOString()}>{(new Date(this.props.data.timestamp)).toISOString()}</time> :
                  ''
            }
        </td>
        <td><ScenarioEditButton data={this.props.data}/></td>
        <td><ScenarioDeleteButton data={this.props.data}/></td>
      </tr>
    )
  }
});

export default ScenarioListItem;
