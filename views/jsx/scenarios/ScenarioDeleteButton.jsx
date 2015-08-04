import React from 'react';
import UserHasRoleMixin from '../UserHasRoleMixin.jsx';
import UserIsCreatorMixin from '../UserIsCreatorMixin.jsx';

var ScenarioDeleteButton = React.createClass({
  mixins: [UserHasRoleMixin, UserIsCreatorMixin],
  handleClick: function () {
    $.ajax({
      url: '/api/v1/scenarios/' + this.props.data._id,
      type: 'DELETE',
      success: function (result) {
        console.log('Deleted');
      }
    });
  },
  render: function () {
    if (this.userHasRole("admin") || this.userIsCreator()) {
      return (
        <button className="scenarioDelete btn btn-default btn-danger" onClick={this.handleClick}>DELETE</button>
      );
    }
    return null;
  }
});

export default ScenarioDeleteButton;
