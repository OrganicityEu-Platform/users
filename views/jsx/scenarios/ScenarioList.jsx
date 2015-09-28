import $                  from 'jquery';
import React              from 'react';
import FlashQueue         from '../FlashQueue.jsx';
import LoadingMixin       from '../LoadingMixin.jsx';
import ScenarioListItem   from './ScenarioListItem.jsx';
import ScenarioThumbnail  from './ScenarioThumbnail.jsx';
import Router             from 'react-router';
import TagField           from '../form-components/TagField.jsx';
import api                from '../../../api_routes.js';
import ui                 from '../../../ui_routes.js';

var Link = Router.Link;

var ScenarioList = React.createClass({
  mixins: [FlashQueue.Mixin, Router.Navigation, LoadingMixin],
  getInitialState: function() {
    return {
      refresh : false,
      scenarios: [],
      search: {
        q       : this.props.query.q,
        actors  : this.props.query.actors ? this.props.query.actors.split(',') : null,
        sectors : this.props.query.sectors ? this.props.query.sectors.split(',') : null,
        devices : this.props.query.devices ? this.props.query.devices.split(',') : null
      },
      sortBy : this.props.query.sortBy,
      sortDir : this.props.query.sortDir
    };
  },
  componentDidMount: function() {
    this.reload();
  },
  buildQueryUrl: function() {
    var query = {};
    if (this.state.search.q) {
      query = $.extend(query, { q : this.state.search.q });
    }
    if (this.state.search.actors) {
      query = $.extend(query, { actors : this.state.search.actors.join(',') });
    }
    if (this.state.search.sectors) {
      query = $.extend(query, { sectors : this.state.search.sectors.join(',') });
    }
    if (this.state.search.devices) {
      query = $.extend(query, { devices : this.state.search.devices.join(',') });
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
  handleUpdatedActors: function(actors) {
    this.state.search.actors = actors;
    this.setState(this.state);
  },
  handleUpdatedSectors: function(sectors) {
    this.state.search.sectors = sectors;
    this.setState(this.state);
  },
  handleUpdatedDevices: function(devices) {
    this.state.search.devices = devices;
    this.setState(this.state);
  },
  handleUpdatedSearchTerm: function(evt) {
    this.state.search.q = evt.target.value;
    this.setState(this.state);
  },
  handleSearch : function(evt) {
    console.log('handleSearch');
    evt.preventDefault();
    console.log(this.state.search);
    this.transitionTo('scenarioList', {}, {
      q : this.state.search.q,
      actors : this.state.search.actors   ? this.state.search.actors.join(',')  : null,
      sectors : this.state.search.sectors ? this.state.search.sectors.join(',') : null,
      devices : this.state.search.devices ? this.state.search.devices.join(',') : null
    });
  },
  componentWillReceiveProps: function(nextProps) {
    this.state.sortBy = nextProps.query.sortBy;
    this.state.sortDir = nextProps.query.sortDir;
    this.setState(this.state);
    this.reload(true);
  },
  render: function() {
    return (
      <div className="scenario-list">
        <div className="row">
          <div className="col-md-12 well">
            <h3>Search and Filter</h3>
            <form className="scenario-list-search-form" onSubmit={this.handleSearch}>
            <div className="form-group">
              <label htmlFor="scenarioListSearchFormActors">Actors</label>&nbsp;
              <TagField
                id="scenarioListSearchFormActors"
                tags={this.state.search.actors}
                placeholder="actor tags"
                onChange={this.handleUpdatedActors} />
            </div>
            &nbsp;
            <div className="form-group">
              <label htmlFor="scenarioListSearchFormSectors">Sectors</label>&nbsp;
              <TagField
                id="scenarioListSearchFormSectors"
                tags={this.state.search.sectors}
                placeholder="sectors tags"
                onChange={this.handleUpdatedSectors} />
            </div>
            &nbsp;
            <div className="form-group">
              <label htmlFor="scenarioListSearchFormDevices">Devices</label>&nbsp;
              <TagField
                id="scenarioListSearchFormDevices"
                tags={this.state.search.devices}
                placeholder="device tags"
                onChange={this.handleUpdatedDevices} />
            </div>
            &nbsp;
            <div className="form-group" id="oc-search-form">
              <label htmlFor="scenarioListSearchFormQ">Search Terms</label>&nbsp;
              <input type="text"
                id="scenarioListSearchFormQ"
                name="q"
                className="form-control"
                placeholder="search scenarios"
                disabled={this.isLoading() ? 'disabled' : ''}
                value={this.state.search.q}
                onChange={this.handleUpdatedSearchTerm} />
              </div>
              <button type="submit"
                value="Search"
                disabled={this.isLoading() ? 'disabled' : ''}
                className="btn btn-primary" id="oc-search-btn">search</button>
            </form>
          </div>
        </div>
        <div className="row scenario-thumbnails">
              {
                this.state.scenarios.map((scenario) => <ScenarioThumbnail key={scenario.uuid} scenario={scenario}
                  onChange={this.reload}/>)
              }
        </div>
      </div>
    );
  }
});

export default ScenarioList;
