import $                from 'jquery';
import React            from 'react';
import FlashQueue       from '../FlashQueue.jsx';
import LoadingMixin     from '../LoadingMixin.jsx';
import ScenarioListItem from './ScenarioListItem.jsx';
import Router           from 'react-router';
import api              from '../../../api_routes.js';
import ui               from '../../../ui_routes.js';

var Link = Router.Link;

var ScenarioList = React.createClass({
  mixins: [FlashQueue.Mixin, Router.Navigation, LoadingMixin],
  getInitialState: function() {
    return {
      refresh : false,
      scenarios: [],
      searchTerm: null,
      sortBy : null,
      sortDir : null
    };
  },
  componentDidMount: function() {
    this.reload();
  },
  buildQueryUrl: function() {
    var query = {};
    if (this.state.searchTerm) {
      query = $.extend(query, { q : this.state.searchTerm });
    }
    if (this.state.sortBy) {
      query = $.extend(query, { sortBy : this.state.sortBy, sortDir : this.state.sortDir });
    }
    return api.reverse('scenario_list', {}, query);
  },
  reload: function(refresh) {
    if (refresh) {
      this.setState({ refresh : true });
    }
    this.loading();
    var url = this.buildQueryUrl();
    $.ajax(url, {
      dataType: 'json',
      error : this.loadingError(url, 'Error querying scenario list'),
      success: (scenarios) => {
        if (this.isMounted()) {
          this.loaded({ scenarios : scenarios, refresh : false });
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
    this.setState({ scenarios : [] });
    this.reload();
  },
  componentWillReceiveProps: function(nextProps) {
    this.state.sortBy = nextProps.query.sortBy;
    this.state.sortDir = nextProps.query.sortDir;
    this.setState(this.state);
    this.reload(true);
  },
  render: function() {
    return (
      <div className="scenarioList">
        <div className="row col-sm-4 pull-right">
          <form name="scenario_search_form" onSubmit={this.handleSearch}>
          <div className="input-group">
            <input type="text"
              name="q"
              className="form-control"
              placeholder="Search for..."
              disabled={this.isLoading() ? 'disabled' : ''}
              value={this.state.searchTerm}
              onChange={this.handleUpdatedSearchTerm} />
            <span className="input-group-btn">
              <input type="submit"
                value="Search"
                disabled={this.isLoading() ? 'disabled' : ''}
                className="btn btn-default">Go!</input>
            </span>
          </div>
          </form>
        </div>
        <div className="row">
          <table className="scenarioListTable">
            <thead>
              <tr>
                <th>
                  <Link to={ui.route('scenarioList')}
                    params={this.props.params}
                    query={$.extend(
                      {},
                      this.props.query,
                      { sortBy : 'title' },
                      { sortDir : (this.state.sortDir == 'asc' ? 'desc' : 'asc') }
                    )}>Title</Link></th>
                <th>Summary</th>
                <th>
                  <Link to={ui.route('scenarioList')}
                    params={this.props.params}
                    query={$.extend(
                      {},
                      this.props.query,
                      { sortBy : 'timestamp' },
                      { sortDir : (this.state.sortDir == 'asc' ? 'desc' : 'asc') }
                    )}>Last Updated</Link>
                  </th>
                <th>Creator</th>
                <th>Version</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                if (this.isLoading() && !this.state.refresh) {
                  return (
                    <tr>
                      <td colSpan="6">Loading...</td>
                    </tr>
                  );
                }
                if (this.state.scenarios.length === 0) {
                  return (
                    <tr>
                      <td colSpan="6">No scenarios found...</td>
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
