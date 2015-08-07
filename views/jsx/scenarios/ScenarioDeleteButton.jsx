import $ from 'jquery';
import React from 'react';
import UserHasRoleMixin from '../UserHasRoleMixin.jsx';
import UserIsCreatorMixin from '../UserIsCreatorMixin.jsx';
import FlashQueue from '../FlashQueue.jsx';
var Router = require('react-router'),
    Navigation = Router.Navigation;

var ScenarioDeleteButton = React.createClass({
  mixins: [Navigation, UserHasRoleMixin, UserIsCreatorMixin, FlashQueue.Mixin],
  handleClick: function () {
    $.ajax({
      url: '/api/v1/scenarios/' + this.props.scenario.uuid,
      type: 'DELETE',
      error: this.flashOnAjaxError('/api/v1/scenarios/' + this.props.scenario.uuid, 'Error trying to delete scenario'),
      success: (result) => {
        this.transitionTo('scenarioList');
        if (typeof this.props.onChange == 'function') {
          this.props.onChange();
        }
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
