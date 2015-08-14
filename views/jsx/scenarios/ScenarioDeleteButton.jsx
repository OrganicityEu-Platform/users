import $                  from 'jquery';
import React              from 'react';
import UserHasRoleMixin   from '../UserHasRoleMixin.jsx';
import UserIsCreatorMixin from '../UserIsCreatorMixin.jsx';
import LoadingMixin       from '../LoadingMixin.jsx';
import api                from '../../../api_routes.js';

var Router = require('react-router');
var Navigation = Router.Navigation;

var ScenarioDeleteButton = React.createClass({
  mixins: [Navigation, UserHasRoleMixin, UserIsCreatorMixin, LoadingMixin],
  handleClick: function() {
    var sure = window.confirm('Are you sure you want to delete this version of the scenario?');
    if (sure) {
      this.loading();
      var url = api.reverse('scenario_by_uuid', { uuid : this.props.scenario.uuid });
      $.ajax(url, {
        type: 'DELETE',
        error: this.loadingError(url, 'Error trying to delete scenario'),
        success: (result) => {
          this.loaded();
          if (typeof this.props.onChange == 'function') {
            this.props.onChange();
          }
        }
      });
    }
  },
  render: function() {
    if (this.userHasRole('admin') || this.userIsCreator(this.props.scenario)) {
      return (
        <button className="scenarioDeleteButton"
          disabled={this.isLoading() ? 'loading' : ''}
          onClick={this.handleClick}>DELETE</button>
      );
    }
    return null;
  }
});

export default ScenarioDeleteButton;
