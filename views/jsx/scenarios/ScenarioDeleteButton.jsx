import React from 'react';
import RoleRequiredMixin from '../RoleRequiredMixin.jsx';
import UserIsOwnerMixin from '../UserIsOwnerMixin.jsx';

var ScenarioDeleteButton = React.createClass({
    mixins: [RoleRequiredMixin, UserIsOwnerMixin],
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
        if (this.permitted("admin") || this.userIsOwner()) {
            return (
                <button className="scenarioDelete btn btn-default btn-danger" onClick={this.handleClick}>DELETE</button>
            );
        }
        return null;
    }
});

export default ScenarioDeleteButton;
