import $                  from 'jquery';
import React              from 'react';

import LoadingMixin       from '../LoadingMixin.jsx';
import I18nMixin          from '../i18n/I18nMixin.jsx';

import ReportThumbnails   from './ReportThumbnails.jsx';
import Router             from 'react-router';
import TagField           from '../form-components/TagField.jsx';
import api                from '../../../api_routes.js';
import ui                 from '../../../ui_routes.js';
import Tags               from '../Tags.jsx';

import { Accordion, Panel } from 'react-bootstrap';

var Link = Router.Link;

import config             from '../../../config/config.js';
import DocumentTitle      from 'react-document-title';

var ReportList = React.createClass({
  mixins: [Router.Navigation, LoadingMixin, I18nMixin],

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
    // this.loading();
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
    // this.loading();
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
    this.reload(true);
  },
  handleUpdatedDomains: function(domains) {
    this.state.search.domains = domains;
    this.setState(this.state);
    this.reload(true);
  },
  handleUpdatedOrganizations: function(organizations) {
    this.state.search.organizations = organizations;
    this.setState(this.state);
    this.reload(true);
  },
  handleUpdatedOrgtypes: function(orgtypes) {
    this.state.search.orgtypes = orgtypes;
    this.setState(this.state);
    this.reload(true);
  },
  handleUpdatedTypes: function(types) {
    this.state.search.types = types;
    this.setState(this.state);
    this.reload(true);
  },
  handleUpdatedApproaches: function(approaches) {
    this.state.search.approaches = approaches;
    this.setState(this.state);
    this.reload(true);
  },
  handleUpdatedTags: function(tags) {
    this.state.search.tags = tags;
    this.setState(this.state);
    this.reload(true);
  },

  handleUpdatedSearchTerm: function(evt) {
    this.state.search.q = evt.target.value;
    this.setState(this.state);
    this.reload(true);
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
    // this.reload(true);
  },
  render: function() {
    var counter = null;
    if (this.state.search.q) {
      counter = (
        <h2 className="oc-white">
          {this.i18n('Reports.your_search_yields_to', 'Your search yields to')} {this.state.reports.length} {this.i18n('Reports.reports', 'reports!')}
        </h2>
      );
    } else {
      counter = (
        <h2 className="oc-white">
          {this.i18n('Reports.here_you_can_explore', 'Here you can explore')} {this.state.reportCounter} {this.i18n('Reports.reports', 'reports!')}
        </h2>
      );
    }

    var tabTitle = config.title + ' | ' +
        this.i18n('Reports.admin',' Admin') + ' | ' +
        this.i18n('Reports.report_list',' Report List');

    return (
      <div className="scenario-list col-lg-8 col-lg-offset-2">
        <DocumentTitle title={tabTitle} />
        <div className="row">
          <div className="col-md-12" id="oc-search-box">
            <form className="scenario-list-search-form" onSubmit={this.handleSearch}>

              <div className="form-group" id="oc-search-form">
                <div className="input-group">
                 <input type="text" className="form-control oc-search-field" id="reportListSearchFormQ"
                        placeholder={this.i18n('Reports.search_reports', "search reports...")}
                        name="q"
                        disabled={this.isLoading() ? 'disabled' : ''}
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
                <Panel
                  header={<span><span className="oc-bold white">filter tags</span><i id="oc-search-desc-icon" className="fa fa-sort-desc white"></i></span>}
                  eventKey="1"
                  className="oc-filters-panel">
                  <div className="oc-filters-info"><i className="fa fa-info-circle"></i> Seeing too many reports? Narrow your search by using the tags below.</div>
                  <div className="form-group">
                    <TagField
                      id="reportListSearchFormAreas"
                      tags={this.state.search.areas}
                      placeholder="Add area tags"
                      onChange={this.handleUpdatedAreas}
                      data={['Global', 'UK', 'DK', 'BE', 'NL', 'BR', 'Copenhagen (DK)', 'EU', 'London (UK)', 'Barcelona (ES)', 'Boston (US)', 'Amsterdam (NL)']}
                      suggestionsLabel="suggestions"
                      />
                  </div>
                  &nbsp;

                  <div className="form-group">
                    <TagField
                      id="reportListSearchFormDomains"
                      tags={this.state.search.domains}
                      placeholder="Add domain tags"
                      onChange={this.handleUpdatedDomains}
                      data={['Energy', 'Environment', 'Resources', 'Mobility', 'Living', 'ICT']}
                      suggestionsLabel="suggestions"
                      />
                  </div>
                  &nbsp;

                  <div className="form-group">
                    <TagField
                      id="reportListSearchFormOrganizations"
                      tags={this.state.search.organizations}
                      placeholder="Add organization tags"
                      onChange={this.handleUpdatedOrganizations}
                      data={['UK Department for Business', 'Innovation & Skills', 'BIS', 'City of London', 'European Parliament', 'European Commission', 'The Climate Group', 'EUROCITIES', 'URBACT']}
                      suggestionsLabel="suggestions"
                      />
                  </div>
                  &nbsp;

                  <div className="form-group">
                    <TagField
                      id="reportListSearchFormOrgtypes"
                      tags={this.state.search.orgtypes}
                      placeholder="Add organization type tags"
                      onChange={this.handleUpdatedOrgtypes}
                      data={['National public institution', 'Universities', 'Non-profit organisations', 'NGOs', 'Foundations', 'Research centres', 'Charities']}
                      suggestionsLabel="suggestions"
                      />
                  </div>
                  &nbsp;

                  <div className="form-group">
                    <TagField
                      id="reportListSearchFormTypes"
                      tags={this.state.search.types}
                      placeholder="Add report type tags"
                      onChange={this.handleUpdatedTypes}
                      data={['Research paper', 'Background paper', 'Catalogue', 'Summit report', 'Scoping paper', 'White paper', 'Brochure', 'Survey']}
                      suggestionsLabel="suggestions"
                      />
                  </div>
                  &nbsp;

                  <div className="form-group">
                    <TagField
                      id="reportListSearchFormApproaches"
                      tags={this.state.search.approaches}
                      placeholder="Add approach tags"
                      onChange={this.handleUpdatedApproaches}
                      data={['Vertical', 'Holistic']}
                      suggestionsLabel="suggestions"
                      />
                  </div>
                  &nbsp;

                  <div className="form-group">
                    <TagField
                      id="reportListSearchFormTags"
                      tags={this.state.search.tags}
                      placeholder="Add report tags"
                      onChange={this.handleUpdatedTags}
                      data={['Smart', 'Water', 'Market', 'Management', 'Energy', 'Cities', 'City', 'Transport', 'Waste', 'Technology', 'Data']}
                      suggestionsLabel="suggestions"
                      />
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
