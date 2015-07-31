import React from 'react';
import UserHasRoleMixin from '../UserHasRoleMixin.jsx';
import UserIsCreatorMixin from '../UserIsCreatorMixin.jsx';

var ScenarioEditButton = React.createClass({
    mixins: [UserHasRoleMixin, UserIsCreatorMixin],
    handleClick: function () {
        window.location = '/scenarios/' + this.props.data._id + '/edit';
    },
    render: function () {
        if (this.userHasRole("admin") || this.userIsCreator()) {
            return (
                <button className="scenarioEdit btn btn-default" onClick={this.handleClick}>EDIT</button>
            );
        }
        return null;
    }
});

export default ScenarioEditButton;
