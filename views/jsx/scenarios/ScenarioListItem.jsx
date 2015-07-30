import React from 'react';
import RoleRequiredMixin from '../RoleRequiredMixin.jsx';

var ScenarioListItem = React.createClass({
    mixins: [RoleRequiredMixin],
    render: function () {
        return (
            <tr>
                <td className="scenarioListItemTitle"><a
                    href={"/scenarios/"+this.props.data._id}>{this.props.data.title}</a></td>
                <td className="scenarioListItemNarrative">{this.props.data.text.replace(/(?:\r\n|\r|\n)/g, '<br>')}</td>
                <td className="scenarioListItemOwner"><a
                    href={"/users/"+this.props.data.owner}>{this.props.data.owner}</a></td>
                <td className="scenarioListItemCreated">
                    <time className="timeago"
                          dateTime={(new Date(this.props.data.created_at)).toISOString()}>{(new Date(this.props.data.created_at)).toISOString()}</time>
                </td>
                <td className="scenarioListItemEdited">
                    <time className="timeago"
                          dateTime={(new Date(this.props.data.updated_at)).toISOString()}>{(new Date(this.props.data.updated_at)).toISOString()}</time>
                </td>
                <td><ScenarioEditButton data={this.props.data}/></td>
                <td><ScenarioDeleteButton data={this.props.data}/></td>
            </tr>
        )
    }
});

export default ScenarioListItem;
