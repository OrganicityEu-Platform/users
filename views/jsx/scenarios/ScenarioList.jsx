import $                    from 'jquery';
import React                from 'react';

import LoadingMixin         from '../LoadingMixin.jsx';

import ScenarioListItem     from './ScenarioListItem.jsx';
import ScenarioThumbnail    from './ScenarioThumbnail.jsx';
import ScenarioThumbnails   from './ScenarioThumbnails.jsx';
import Router               from 'react-router';
import TagField             from '../form-components/TagField.jsx';
import api                  from '../../../api_routes.js';
import ui                   from '../../../ui_routes.js';
import Tags                 from '../Tags.jsx';

import { Accordion, Panel } from 'react-bootstrap';

import config               from '../../../config/config.js';
import DocumentTitle        from 'react-document-title';
import I18nMixin            from '../i18n/I18nMixin.jsx';

var Link = Router.Link;

var ScenarioList = React.createClass({
  mixins: [Router.Navigation, LoadingMixin, I18nMixin],
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
    //this.loading();
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
    //this.loading();
    var url = this.buildQueryUrl();
    $.ajax(url, {
      dataType: 'json',
      error : this.loadingError(url, 'Error querying scenario list'),
      success: (scenarios) => {
        if (this.isMounted()) {
          this.loaded({
            scenarios : scenarios,
            refresh : false,
            scenarioCounter : scenarios.length
          });
        }
      }
    });
  },
  handleUpdatedActors: function(actors) {
    this.state.search.actors = actors;
    this.setState(this.state);
    this.reload(true);
  },
  handleUpdatedSectors: function(sectors) {
    this.state.search.sectors = sectors;
    this.setState(this.state);
    this.reload(true);
  },
  handleUpdatedDevices: function(devices) {
    this.state.search.devices = devices;
    this.setState(this.state);
    this.reload(true);
  },
  handleUpdatedSearchTerm: function(evt) {
    this.state.search.q = evt.target.value;
    this.setState(this.state);
    this.reload(true);
  },
  handleSearch : function(evt) {
    // console.log('handleSearch');
    evt.preventDefault();
    // console.log(this.state.search);
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
    //this.reload(true);
  },
  render: function() {

    var counter = null;
    if (this.state.search.q) {
      counter = (
        <h2 className="oc-white">
          Your search yields to {this.state.scenarios.length} scenarios!
        </h2>
      );
    } else {
      counter = (
        <h2 className="oc-white">
          Here you can explore {this.state.scenarioCounter} scenarios!
        </h2>
      );
    }
    var scenarios = (
      <div className="scenario-list">
        <DocumentTitle title={config.title + ' | ' + this.i18n('explore', 'Explore')} />
        <h1 className="oc-pink">
          {this.i18n('explore_scenarios', 'Explore scenarios')}
        </h1>
        <div className="row">
          <div className="col-md-12" id="oc-search-box">
            <form
              className="scenario-list-search-form"
              onSubmit={this.handleSearch}>
              <div className="form-group" id="oc-search-form">
                <div className="input-group">
                  <input
                    type="text"
                    id="scenarioListSearchFormQ"
                    className="oc-input-extra"
                    placeholder={this.i18n('search_all_scenarios', 'Search all scenarios')}
                    autoComplete="off"
                    name="q"
                    disabled={this.isLoading() ? 'disabled' : ''}
                    value={this.state.search.q}
                    onChange={this.handleUpdatedSearchTerm}/>
                  <span className="input-group-btn">
                    <button
                      type="submit"
                      value="Search"
                      disabled={this.isLoading() ? 'disabled' : ''}
                      className="btn btn-primary"
                      id="oc-search-btn">
                      <span className="fa fa-search">
                      </span>
                    </button>
                  </span>
                </div>
              </div>
            </form>
          </div>
        </div>
        <ScenarioThumbnails
          scenarios={this.state.scenarios}
          limit={15}
          counter={false} />
      </div>
    );

    return scenarios;
  }
});

export default ScenarioList;
