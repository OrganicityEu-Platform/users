import $                from 'jquery';
import React            from 'react';
import FlashQueue       from '../FlashQueue.jsx';
import ScenarioListItem from './ScenarioListItem.jsx';
import Router           from 'react-router';
import api              from '../../../api_routes.js';
import ui               from '../../../ui_routes.js';

var Link = Router.Link;

var ScenarioList = React.createClass({
  mixins: [FlashQueue.Mixin, Router.Navigation],
  getInitialState: function () {
    return {
      scenarios: [],
      searchTerm: null,
      sortBy : null
    }
  },
  componentDidMount: function () {
    this.reload();
  },
  buildQueryUrl: function() {
    var query = {};
    if (this.state.searchTerm) {
      query = $.extend(query, { q : this.state.searchTerm });
    }
    if (this.state.sortBy) {
      query = $.extend(query, { sortBy : this.state.sortBy });
    }
    return api.reverse('scenario_list', {}, query);
  },
  reload: function() {
    var url = this.buildQueryUrl();
    console.log(url);
    $.ajax(url, {
      dataType: 'json',
      error: this.flashOnAjaxError(url, 'Error querying scenario list'),
      success: (scenarios) => {
        if (this.isMounted()) {
          this.state.scenarios = scenarios;
          this.setState(this.state);
        }
      }
    });
  },
  handleUpdatedSearchTerm: function(evt) {
    this.state.searchTerm = evt.target.value;
    this.setState(this.state);
  },
  handleSearch : function(evt) {
    evt.preventDefault();
    this.reload();
  },
  componentWillReceiveProps: function(nextProps) {
    this.state.sortBy = nextProps.query.sortBy;
    this.setState(this.state);
    this.reload();
  },
  render: function () {
    return (
      <div className="scenarioList">
        <div className="row col-sm-4 pull-right">
          <form name="scenario_search_form" onSubmit={this.handleSearch}>
          <div className="input-group">
            <input type="text" name="q" className="form-control" placeholder="Search for..." value={this.state.searchTerm} onChange={this.handleUpdatedSearchTerm} />
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
                <th><Link to={ui.route('scenarioList')} params={this.props.params} query={$.extend({}, this.props.query, { sortBy : 'title' })}>Title</Link></th>
                <th>Summary</th>
                <th><Link to={ui.route('scenarioList')} params={this.props.params} query={$.extend({}, this.props.query, { sortBy : 'timestamp' })}>Last Updated</Link></th>
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
      </div>
    );
  }
});

export default ScenarioList;
