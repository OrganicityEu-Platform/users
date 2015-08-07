import $                from 'jquery';
import React            from 'react';
import ScenarioListItem from './ScenarioListItem.jsx';
import api              from '../../../api_routes.js';

var ScenarioList = React.createClass({
  getInitialState: function () {
    return null;
  },
  componentDidMount: function () {
    this.reload();
  },
  reload: function() {
    var url = api.reverse('scenario_list');
    console.log(api);
    console.log(api.reverse);
    console.log(url);
    $.getJSON(url, (scenarios) => {
      if (this.isMounted()) {
        this.setState({
          scenarios: scenarios
        });
      }
    });
  },
  render: function () {
    if (this.state == null) {
      return null;
    }
    return (
      <div className="scenarioList">
        <table className="scenarioListTable">
          <thead>
            <tr>
              <th>Title</th>
              <th>Summary</th>
              <th>Last Updated</th>
              <th>Creator</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              if (this.state.scenarios.length == 0) {
                return (
                  <tr>
                    <td colSpan="5">No scenarios found....</td>
                  </tr>
                )
              }
            })()}
            {
              this.state.scenarios.map((scenario) => <ScenarioListItem key={scenario.uuid} scenario={scenario} onChange={this.reload}/>)
            }
          </tbody>
        </table>
      </div>
    );
  }
});

export default ScenarioList;
