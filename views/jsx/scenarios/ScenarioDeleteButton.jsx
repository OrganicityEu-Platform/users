import $                  from 'jquery';
import React              from 'react';
import UserHasRoleMixin   from '../UserHasRoleMixin.jsx';
import UserIsCreatorMixin from '../UserIsCreatorMixin.jsx';
import FlashQueue         from '../FlashQueue.jsx';
import api                from '../../../api_routes.js';

var Router = require('react-router'),
    Navigation = Router.Navigation;

var ScenarioDeleteButton = React.createClass({
  mixins: [Navigation, UserHasRoleMixin, UserIsCreatorMixin, FlashQueue.Mixin],
  handleClick: function () {
    var url = api.reverse('scenario_by_uuid', { uuid : this.props.scenario.uuid });
    $.ajax(url, {
      type: 'DELETE',
      error: this.flashOnAjaxError(url, 'Error trying to delete scenario'),
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
