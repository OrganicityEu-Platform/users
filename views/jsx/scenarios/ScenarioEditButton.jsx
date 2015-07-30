import React from 'react';
import RoleRequiredMixin from '../RoleRequiredMixin.jsx';
import UserIsOwnerMixin from '../UserIsOwnerMixin.jsx';

var ScenarioEditButton = React.createClass({
    mixins: [RoleRequiredMixin, UserIsOwnerMixin],
    handleClick: function () {
        window.location = '/scenarios/' + this.props.data._id + '/edit';
    },
    render: function () {
        if (this.permitted("admin") || this.userIsOwner()) {
            return (
                <button className="scenarioEdit btn btn-default" onClick={this.handleClick}>EDIT</button>
            );
        }
        return null;
    }
});

export default ScenarioEditButton;
