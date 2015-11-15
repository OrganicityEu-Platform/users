import $                  from 'jquery';
import React              from 'react';
import LoadingMixin       from '../LoadingMixin.jsx';
import api                from '../../../api_routes.js';
import ScenarioThumbnails from '../scenarios/ScenarioThumbnails.jsx';

import config             from '../../../config/config.js';

var Router = require('react-router');
var Link = Router.Link;

var ScenariosNewest = React.createClass({
  mixins: [LoadingMixin],
  getInitialState: function() {
    return {
      loading: true,
      user: null
    };
  },
  componentDidMount: function() {
    this.loading();

    var options = {
      creator : this.props.creator,
      sortBy : 'timestamp',
      sortDir : 'DESC',
      limit : this.props.limit
    };

    var url = api.reverse('scenario_list', options);

    $.ajax(url, {
      dataType : 'json',
      error : (xhr, textStatus, errorThrown) => {
        this.loaded();
        if (config.dev) {
          this.flashOnAjaxError(url, 'Error loading newest scenarios')(xhr, textStatus, errorThrown);
        } else {
          this.flash('danger', 'Error loading newest scenarios');
        }
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
      <div>
        <ScenarioThumbnails scenarios={this.state.scenarios} counter={this.props.counter} />
      </div>
    );
  }
});

export default ScenariosNewest;
