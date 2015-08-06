import React from 'react';
import UserHasRoleMixin from '../UserHasRoleMixin.jsx';
import UserIsCreatorMixin from '../UserIsCreatorMixin.jsx';
var Router = require('react-router');

var ScenarioEditButton = React.createClass({
  mixins: [Router.Navigation, UserHasRoleMixin, UserIsCreatorMixin],
  handleClick: function () {
    this.transitionTo('scenarioEdit', { uuid: this.props.scenario.uuid });
  },
  render: function () {
    if (this.userHasRole("admin") || this.userIsCreator(this.props.scenario)) {
      return (
        <button className="scenarioEdit btn btn-default" onClick={this.handleClick}>EDIT</button>
      );
    }
    return null;
  }
});

export default ScenarioEditButton;
