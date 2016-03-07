import $      from 'jquery';
import api    from '../../api_routes.js';
import React  from 'react';

var ScenarioEvaluationsCount = React.createClass({
  getInitialState: function() {
    return {
      count: null
    };
  },
  componentWillMount: function() {
    var url = api.reverse('feedback_by_scenario', { uuid : this.props.uuid });
    $.ajax({
      dataType: 'json',
      url: url,
      success: (evaluations) => {
          this.setState({count: evaluations.length});
      }
    });
  },
  render: function() {
    return(
        <span>{this.state.count}</span>
    );
  }
});

export default ScenarioEvaluationsCount;
