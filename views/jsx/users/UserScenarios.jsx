import $                  from 'jquery';
import React              from 'react';
import LoadingMixin       from '../LoadingMixin.jsx';
import api                from '../../../api_routes.js';
import ScenarioThumbnail  from '../scenarios/ScenarioThumbnail.jsx';

var Router = require('react-router');
var Link = Router.Link;

var UserScenarios = React.createClass({
  mixins: [LoadingMixin],
  getInitialState: function() {
    return {
      loading: true,
      user: null
    };
  },
  componentDidMount: function() {
    this.loading();

    var url = api.reverse('scenario_list', {
      creator : this.props.uuid,
      sortBy : 'timestamp',
      sortDir : 'DESC'
    });

    $.ajax(url, {
      dataType : 'json',
      error : (jqXHR, textStatus, errorThrown) => {
        this.loaded();
        this.flashOnAjaxError(url, 'Error loading user info')(jqXHR, textStatus, errorThrown);
      },
      success : (scenarios) => {
        this.state.scenarios = scenarios;
        this.setState(this.state);
        this.loaded();
      }
    });
  },
  render: function() {
    if (this.state.loading) {
      return <div>Loading User Scenarios...</div>;
    }
    return (
      <div className="row scenario-thumbnails">
      {
        this.state.scenarios.map((scenario) => <ScenarioThumbnail key={scenario.uuid} scenario={scenario}
          onChange={this.reload}/>)
      }
      </div>
    );
  }
});

export default UserScenarios;
