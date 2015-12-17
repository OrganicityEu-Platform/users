import $                  from 'jquery';
import React              from 'react';

import LoadingMixin       from '../LoadingMixin.jsx';

// import ScenarioListItem   from './ScenarioListItem.jsx';
// import ScenarioThumbnail  from './ScenarioThumbnail.jsx';
import ReportThumbnails   from './ReportThumbnails.jsx';
import Router             from 'react-router';
import TagField           from '../form-components/TagField.jsx';
import api                from '../../../api_routes.js';
import ui                 from '../../../ui_routes.js';
import Tags               from '../Tags.jsx';
import Loading            from '../Loading.jsx';

import { Accordion, Panel } from 'react-bootstrap';

var Link = Router.Link;

var ReportList = React.createClass({
  mixins: [Router.Navigation, LoadingMixin],
  getInitialState: function() {
    return {
      refresh : false,
      reports: [],
      search: {
        q       : this.props.query.q,
        areas : this.props.query.areas ? this.props.query.areas.split(',') : null,
        domains : this.props.query.domains ? this.props.query.domains.split(',') : null,
        organizations : this.props.query.organizations ? this.props.query.organizations.split(',') : null,
        orgtypes : this.props.query.orgtypes ? this.props.query.orgtypes.split(',') : null,
        types : this.props.query.types ? this.props.query.types.split(',') : null,
        approaches : this.props.query.approaches ? this.props.query.approaches.split(',') : null,
        tags : this.props.query.tags ? this.props.query.tags.split(',') : null
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
    if (this.state.search.areas) {
      query = $.extend(query, { areas : this.state.search.areas.join(',') });
    }
    if (this.state.search.domains) {
      query = $.extend(query, { domains : this.state.search.domains.join(',') });
    }
    if (this.state.search.organizations) {
      query = $.extend(query, { organizations : this.state.search.organizations.join(',') });
    }
    if (this.state.search.orgtypes) {
      query = $.extend(query, { orgtypes : this.state.search.orgtypes.join(',') });
    }
    if (this.state.search.types) {
      query = $.extend(query, { types : this.state.search.types.join(',') });
    }
    if (this.state.search.approaches) {
      query = $.extend(query, { approaches : this.state.search.approaches.join(',') });
    }
    if (this.state.search.tags) {
      query = $.extend(query, { tags : this.state.search.tags.join(',') });
    }
    if (this.state.sortBy) {
      query = $.extend(query, { sortBy : this.state.sortBy, sortDir : this.state.sortDir });
    }
    return api.reverse('report_list', {}, query);
  },
  reload: function(refresh) {
    if (refresh) {
      this.setState({ refresh : true });
    }
    this.loading();
    var url = this.buildQueryUrl();
    $.ajax(url, {
      dataType: 'json',
      error : this.loadingError(url, 'Error querying report list'),
      success: (reports) => {
        if (this.isMounted()) {
          this.loaded({
            reports : reports,
            refresh : false,
            reportCounter : reports.length
          });
        }
      }
    });
  },

  handleUpdatedAreas: function(areas) {
    this.state.search.areas = areas;
    this.setState(this.state);
  },
  handleUpdatedDomains: function(domains) {
    this.state.search.domains = domains;
    this.setState(this.state);
  },
  handleUpdatedOrganizations: function(organizations) {
    this.state.search.organizations = organizations;
    this.setState(this.state);
  },
  handleUpdatedOrgtypes: function(orgtypes) {
    this.state.search.orgtypes = orgtypes;
    this.setState(this.state);
  },
  handleUpdatedTypes: function(types) {
    this.state.search.types = types;
    this.setState(this.state);
  },
  handleUpdatedApproaches: function(approaches) {
    this.state.search.approaches = approaches;
    this.setState(this.state);
  },
  handleUpdatedTags: function(tags) {
    this.state.search.tags = tags;
    this.setState(this.state);
  },

  handleUpdatedSearchTerm: function(evt) {
    this.state.search.q = evt.target.value;
    this.setState(this.state);
  },
  handleSearch : function(evt) {
    //console.log('handleSearch');
    evt.preventDefault();
    // console.log(this.state.search);
    this.transitionTo('reportList', {}, {
      q : this.state.search.q,
      areas : this.state.search.areas   ? this.state.search.areas.join(',')  : null,
      domains : this.state.search.domains ? this.state.search.domains.join(',') : null,
      organizations : this.state.search.organizations ? this.state.search.organizations.join(',') : null,
      orgtypes : this.state.search.orgtypes   ? this.state.search.orgtypes.join(',')  : null,
      types : this.state.search.types ? this.state.search.types.join(',') : null,
      approaches : this.state.search.approaches ? this.state.search.approaches.join(',') : null,
      tags : this.state.search.tags ? this.state.search.tags.join(',') : null
    });
  },
  componentWillReceiveProps: function(nextProps) {
    this.state.sortBy = nextProps.query.sortBy;
    this.state.sortDir = nextProps.query.sortDir;
    this.setState(this.state);
    this.reload(true);
  },
  render: function() {

    if (this.isLoading()) {
      return (<Loading message="Loading reports. Please wait." size="2"/>);
    }

    var counter = null;
    if (this.state.search.q) {
      counter = (
        <span>Your search yields to {this.state.reports.length} reports!</span>
      );
    } else {
      counter = (
        <span>Here you can explore {this.state.reportCounter} reports!</span>
      );
    }

    return (
      <div className="scenario-list col-lg-8 col-lg-offset-2">
        <div className="row">
          <div className="col-md-12" id="oc-search-box">
            <form className="scenario-list-search-form" onSubmit={this.handleSearch}>

              <div className="form-group" id="oc-search-form">
                <div className="input-group">
                 <input type="text" className="form-control oc-search-field" id="reportListSearchFormQ" placeholder="search reports..." name="q" disabled={this.isLoading() ? 'disabled' : ''}
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
                  <div className="form-group">
                    <TagField
                      id="reportListSearchFormAreas"
                      tags={this.state.search.areas}
                      placeholder="Areas"
                      onChange={this.handleUpdatedAreas} />
                  </div>
                  &nbsp;

                  <div className="form-group">
                    <TagField
                      id="reportListSearchFormDomains"
                      tags={this.state.search.domains}
                      placeholder="Domains"
                      onChange={this.handleUpdatedDomains} />
                  </div>
                  &nbsp;

                  <div className="form-group">
                    <TagField
                      id="reportListSearchFormOrganizations"
                      tags={this.state.search.organizations}
                      placeholder="Organizations"
                      onChange={this.handleUpdatedOrganizations} />
                  </div>
                  &nbsp;

                  <div className="form-group">
                    <TagField
                      id="reportListSearchFormOrgtypes"
                      tags={this.state.search.orgtypes}
                      placeholder="Organization Types"
                      onChange={this.handleUpdatedOrgtypes} />
                  </div>
                  &nbsp;

                  <div className="form-group">
                    <TagField
                      id="reportListSearchFormTypes"
                      tags={this.state.search.types}
                      placeholder="Report types"
                      onChange={this.handleUpdatedTypes} />
                  </div>
                  &nbsp;

                  <div className="form-group">
                    <TagField
                      id="reportListSearchFormApproaches"
                      tags={this.state.search.approaches}
                      placeholder="Approaches"
                      onChange={this.handleUpdatedApproaches} />
                  </div>
                  &nbsp;

                  <div className="form-group">
                    <TagField
                      id="reportListSearchFormTags"
                      tags={this.state.search.tags}
                      placeholder="Tags"
                      onChange={this.handleUpdatedTags} />
                  </div>
                  &nbsp;
                </Panel>
              </Accordion>
            </form>

          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            {counter}
          </div>
        </div>
        <ReportThumbnails reports={this.state.reports} counter={false} />
      </div>
    );
  }
});

export default ReportList;
