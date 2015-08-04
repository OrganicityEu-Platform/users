import React from 'react';
import UserHasRoleMixin from '../UserHasRoleMixin.jsx';
import UserIsCreatorMixin from '../UserIsCreatorMixin.jsx';
var Router = require('react-router');

var ScenarioDeleteButton = React.createClass({
  mixins: [Router.Navigation, UserHasRoleMixin, UserIsCreatorMixin],
  handleClick: function () {
    $.ajax({
      url: '/api/v1/scenarios/' + this.props.scenario._id,
      type: 'DELETE',
      success: function (result) {
        this.transitionTo('scenarioList');
      }
    });
  },
  render: function () {
    if (this.userHasRole("admin") || this.userIsCreator(this.props.scenario)) {
      return (
        <button className="scenarioDelete btn btn-default btn-danger" onClick={this.handleClick}>DELETE</button>
      );
    }
    return null;
  }
});

export default ScenarioDeleteButton;
