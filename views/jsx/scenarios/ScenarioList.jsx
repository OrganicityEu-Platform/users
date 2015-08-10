import $                from 'jquery';
import React            from 'react';
import FlashQueue       from '../FlashQueue.jsx';
import ScenarioListItem from './ScenarioListItem.jsx';
import api              from '../../../api_routes.js';

var ScenarioList = React.createClass({
  mixins: [FlashQueue.Mixin],
  getInitialState: function() {
    return {
      scenarios: [],
      searchTerm: ''
    };
  },
  componentDidMount: function() {
    this.reload();
  },
  reload: function() {
    var url = api.reverse('scenario_list');
    $.getJSON(url, (scenarios) => {
      if (this.isMounted()) {
        this.state.scenarios = scenarios;
        this.setState(this.state);
      }
    });
  },
  handleUpdatedSearchTerm: function(evt) {
    this.state.searchTerm = evt.target.value;
    this.setState(this.state);
  },
  handleSearch : function(evt) {
    evt.preventDefault();
    var url = api.reverse('scenario_list', {}, { q : this.state.searchTerm });
    $.ajax(url, {
      dataType: 'json',
      error: this.flashOnAjaxError(url, 'Error querying scenario list'),
      sucess: (scenarios) => {
        if (this.isMounted()) {
          this.state.scenarios = scenarios;
          this.setState(this.state);
        }
      }
    });
  },
  render: function() {
    return (
      <div className="scenarioList">
        <div className="row col-sm-4 pull-right">
          <form name="scenario_search_form" onSubmit={this.handleSearch}>
          <div className="input-group">
            <input type="text" name="q" className="form-control" placeholder="Search for..."
              value={this.state.searchTerm} onChange={this.handleUpdatedSearchTerm} />
            <span className="input-group-btn">
              <input type="submit" value="Search" className="btn btn-default">Go!</input>
            </span>
          </div>
          </form>
        </div>
        <div className="row">
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
                  );
                }
              })()}
              {
                this.state.scenarios.map((scenario) => <ScenarioListItem key={scenario.uuid} scenario={scenario}
                  onChange={this.reload}/>)
              }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
});

export default ScenarioList;
