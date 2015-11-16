import $                  from 'jquery';
import React              from 'react';

import LoadingMixin       from '../LoadingMixin.jsx';

import ScenarioListItem   from './ScenarioListItem.jsx';
import ScenarioThumbnail  from './ScenarioThumbnail.jsx';
import ScenarioThumbnails from './ScenarioThumbnails.jsx';
import Router             from 'react-router';
import TagField           from '../form-components/TagField.jsx';
import api                from '../../../api_routes.js';
import ui                 from '../../../ui_routes.js';
import Tags               from '../Tags.jsx';
import { Accordion, Panel } from 'react-bootstrap';

var Link = Router.Link;

var ScenarioList = React.createClass({
  mixins: [Router.Navigation, LoadingMixin],
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
    this.loading();
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
      <div className="scenario-list col-lg-8 col-lg-offset-2">
        <div className="row">
          <div className="col-md-12">
            Here you can explore {this.state.scenarios.length} scenarios!
          </div>
        </div>
        <div className="row">
          <div className="col-md-12" id="oc-search-box">
            <form className="scenario-list-search-form" onSubmit={this.handleSearch}>

              <div className="form-group" id="oc-search-form">
                <div className="input-group">
                 <input type="text" className="form-control oc-search-field" id="scenarioListSearchFormQ" placeholder="search scenarios..." name="q" disabled={this.isLoading() ? 'disabled' : ''}
                 value={this.state.search.q}
                 onChange={this.handleUpdatedSearchTerm}/>
                 <span className="input-group-btn">
                   <button type="submit"
                     value="Search"
                     disabled={this.isLoading() ? 'disabled' : ''}
                     className="btn btn-primary" id="oc-search-btn"><span className="fa fa-search"></span></button>
                 </span>
                </div>

                </div>
              <Accordion>
                <Panel header="filters" eventKey="1" className="oc-filters-panel">
                  <div className="oc-sector-tags-wrapper">
                      <Tags suggestions={['public', 'energy', 'transport', 'cultural', 'environment', 'healthcare', 'retail', 'agriculture']} text="public"/>
                  </div>
                  <div className="oc-actor-tags-wrapper">
                    <Tags suggestions={['designer', 'researcher', 'rapper', 'citizen']} text="citizen"/>
                  </div>
                  <div className="oc-tools-tags-wrapper">
                    <Tags suggestions={['wearables', 'ultra sonic sensors', 'IR sensors', 'Holograms', 'Augmented reality']} text="mobile"/>
                  </div>
                  <div className="form-group">
                    <TagField
                      id="scenarioListSearchFormActors"
                      tags={this.state.search.actors}
                      placeholder="actor tags"
                      onChange={this.handleUpdatedActors} />
                  </div>
                  &nbsp;
                  <div className="form-group">
                    <TagField
                      id="scenarioListSearchFormSectors"
                      tags={this.state.search.sectors}
                      placeholder="sectors tags"
                      onChange={this.handleUpdatedSectors} />
                  </div>
                  &nbsp;
                  <div className="form-group" id="oc-devices-form">
                    <TagField
                      id="scenarioListSearchFormDevices"
                      tags={this.state.search.devices}
                      placeholder="device tags"
                      onChange={this.handleUpdatedDevices} />
                  </div>
                  &nbsp;
                </Panel>
              </Accordion>
            </form>

          </div>
        </div>
        <ScenarioThumbnails scenarios={this.state.scenarios} counter={false} />
      </div>
    );
  }
});

export default ScenarioList;
