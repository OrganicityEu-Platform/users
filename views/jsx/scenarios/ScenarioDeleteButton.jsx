import React from 'react';
import RoleRequiredMixin from '../RoleRequiredMixin.jsx';
import UserIsCreatorMixin from '../UserIsCreatorMixin.jsx';

var ScenarioDeleteButton = React.createClass({
    mixins: [RoleRequiredMixin, UserIsCreatorMixin],
    handleClick: function () {
        $.ajax({
            url: '/scenarios/' + this.props.data._id,
            type: 'DELETE',
            success: function (result) {
                console.log('Deleted');
            }
        });
    },
    render: function () {
        if (this.permitted("admin") || this.userIsCreator()) {
            return (
                <button className="scenarioDelete btn btn-default btn-danger" onClick={this.handleClick}>DELETE</button>
            );
        }
        return null;
    }
});

export default ScenarioDeleteButton;
