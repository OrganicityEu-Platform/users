import React from 'react';
import RoleRequiredMixin from '../RoleRequiredMixin.jsx';
import UserIsCreatorMixin from '../UserIsCreatorMixin.jsx';

var ScenarioEditButton = React.createClass({
    mixins: [RoleRequiredMixin, UserIsCreatorMixin],
    handleClick: function () {
        window.location = '/scenarios/' + this.props.data._id + '/edit';
    },
    render: function () {
        if (this.permitted("admin") || this.userIsCreator()) {
            return (
                <button className="scenarioEdit btn btn-default" onClick={this.handleClick}>EDIT</button>
            );
        }
        return null;
    }
});

export default ScenarioEditButton;
