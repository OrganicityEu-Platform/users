import $                  from 'jquery';
import React              from 'react';
import api                from '../../../api_routes.js';
import ScenarioThumbnails from '../scenarios/ScenarioThumbnails.jsx';

import LoadingMixin       from '../LoadingMixin.jsx';

var ScenariosNewest = React.createClass({
  mixins: [LoadingMixin],
  getInitialState: function() {
    return {
      loading: true,
      user: null,
      scnearios: []
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
      error : this.loadingError(url, 'Error loading newest scenarios'),
      success : (scenarios) => {
        this.loaded({
          scenarios: scenarios
        });
      }
    });
  },
  render: function() {
    if (this.state.loading) {
      return <div>Loading Scenarios...</div>;
    }

    return (
      <div>
        <h1 className="oc-pink">Latest scenarios</h1>
        <ScenarioThumbnails scenarios={this.state.scenarios} counter={this.props.counter} />
      </div>
    );
  }
});

export default ScenariosNewest;
