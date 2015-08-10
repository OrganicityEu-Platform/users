import React                from 'react';
import ScenarioEditButton   from './ScenarioEditButton.jsx';
import ScenarioDeleteButton from './ScenarioDeleteButton.jsx';
import UserAvatar           from '../users/UserAvatar.jsx';
import TimeAgo              from 'react-timeago';

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
                <TimeAgo date={this.props.scenario.timestamp} /> :
                ''
          }
        </td>
        <td><UserAvatar uuid={this.props.scenario.creator} /></td>
        <td><ScenarioEditButton scenario={this.props.scenario} onChange={this.props.onChange} /></td>
        <td><ScenarioDeleteButton scenario={this.props.scenario} onChange={this.props.onChange} /></td>
      </tr>
    )
  }
});

export default ScenarioListItem;
