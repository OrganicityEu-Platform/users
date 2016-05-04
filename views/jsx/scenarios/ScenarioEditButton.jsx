import React from 'react';
import UserHasRoleMixin from '../UserHasRoleMixin.jsx';
import UserIsCreatorMixin from '../UserIsCreatorMixin.jsx';
import I18nMixin from '../i18n/I18nMixin.jsx';

var Router = require('react-router');

var ScenarioEditButton = React.createClass({
  mixins: [Router.Navigation, UserHasRoleMixin, UserIsCreatorMixin, I18nMixin],
  handleClick: function() {
    this.transitionTo('scenarioEdit', { uuid: this.props.scenario.uuid });
    if (typeof this.props.onChange == 'function') {
      this.props.onChange();
    }
  },
  render: function() {
    if (this.userHasRole('admin') || this.userIsCreator(this.props.scenario)) {
      return (
        <button className="oc-button all-uppercase" onClick={this.handleClick}>{this.i18n('Admin.edit', 'EDIT')}</button>
      );
    }
    return null;
  }
});

export default ScenarioEditButton;
