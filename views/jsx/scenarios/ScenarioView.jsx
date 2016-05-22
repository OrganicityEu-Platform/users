import $                    from 'jquery';
import React                from 'react';
import Router               from 'react-router';
import ReactDisqusThread    from 'react-disqus-thread';

import ScenarioTableView    from './ScenarioTableView.jsx';

import ScenarioEditButton   from './ScenarioEditButton.jsx';

import ScenarioDeleteButton from './ScenarioDeleteButton.jsx';

import api                  from '../../../api_routes.js';
import Message              from '../Message.jsx';

import config               from '../../../config/config.js';
import DocumentTitle        from 'react-document-title';

import Feedback             from './Feedback.jsx';
import ScenarioRating       from './ScenarioRating.jsx';

import UserIsLoggedInMixin  from './../UserIsLoggedInMixin.jsx';
import UserIsCreatorMixin   from '../UserIsCreatorMixin.jsx';
import LoadingMixin         from '../LoadingMixin.jsx';
import FlashQueue           from '../FlashQueue.jsx';
import I18nMixin            from '../i18n/I18nMixin.jsx';

var ScenarioView = React.createClass({
  mixins: [UserIsCreatorMixin, UserIsLoggedInMixin, LoadingMixin, FlashQueue.Mixin, Router.Navigation],
  getInitialState: function() {
    return null;
  },
  componentDidMount: function() {
    this.loading();
    this.getScenario();
  },
  getScenario: function() {
    var url = api.reverse('scenario_by_uuid', { uuid : this.props.params.uuid });
    var showEval = null;
    $.ajax({
      dataType: 'json',
      url: url,
      success: (scenario) => {
        if (this.isMounted()) {
          this.setState(scenario);
          this.setState({undo: true});
          this.loaded();
        }
      },
      error: (jqXHR, textStatus, errorThrown) => {
        this.setState({
          error: jqXHR
        });
      }
    });
  },
  handleDelete: function() {
    this.setState({deleted: true});
    this.transitionTo('scenarioCreate');
    this.flash('success', 'DELETED SCENARIO', 5000);
  },
  handleUndo: function() {
    // TODO: compare PREVIOUS scenario state with current and print CHANGES to flash
    this.getScenario();
    if(this.state.undo) {
      this.flash('success', 'UNDID CHANGES' /* + CHANGES*/ , 5000);
    }
  },
  render: function() {

    if (this.state.deleted) {
      return null;
    }

    if (this.state === null) {
      return null;
    }

    if (this.isLoading()) {
      if (this.state.error) {
        var message = (this.state.error.status + ': ' + this.state.error.statusText);
        return (
          <div className="oc-macro-content">
            <Message type="danger" message={message} />
          </div>
        );
      }
      return this.renderLoading();
    }

    return (
      <div>
        <DocumentTitle title={config.title + ' | Scenario | ' + this.state.title} />
        <div className="row">
          <ScenarioTableView scenario={this.state} />
        </div>
        <Feedback scenario={this.state}>
        </Feedback>
        <div className="row">
          <div className="form-group">
            <div className="oc-macro-content oc-scenario-controls">
              <div className="col-sm-4">
                <ScenarioEditButton scenario={this.state}/>
              </div>
              <div className="col-sm-4">

              </div>
              <div className="col-sm-4">
                <ScenarioDeleteButton
                  handleUndo={this.handleUndo}
                  handleDelete={this.handleDelete}
                  scenario={this.state}/>
              </div>
            </div>
          </div>
        </div>
        <div className="oc-macro-content">
          <div className="oc-disqus-wrapper">
            <ReactDisqusThread
              categoryId="3957189"
              shortname="organicity"
              identifier={this.state.uuid}
              title={this.state.title}/>
          </div>
        </div>
      </div>
    );
  }
});

export default ScenarioView;
