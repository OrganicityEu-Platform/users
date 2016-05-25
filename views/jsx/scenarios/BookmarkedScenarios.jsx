import React from 'react';
import api                  from '../../../api_routes.js';
import $                    from 'jquery';
import ScenarioThumbnails   from './ScenarioThumbnails.jsx';

var BookmarkedScenarios = React.createClass({
  getInitialState: function() {
    return {
      scenarios: []
    };
  },
  componentDidMount: function() {
    var options = {
      bundle: this.props.bundle // [""] of uuids
    };

    var url = api.reverse('scenario_list', options);

    $.ajax(url, {
      dataType : 'json',
      success : (scenarios) => {
        this.setState({
          scenarios: scenarios
        });
      }
    });
  },
  render: function() {
    return(<div>
      <h2 className="pink">Bookmarked Scenarios</h2>
      <ScenarioThumbnails
        scenarios={this.state.scenarios}
        counter={false} />
    </div>);
  }
});

export default BookmarkedScenarios;
