import $                    from 'jquery';
import React                from 'react';
import Router               from 'react-router';
import ReactDisqusThread    from 'react-disqus-thread';

import ScenarioTableView    from './ScenarioTableView.jsx';

import ScenarioEditButton   from './ScenarioEditButton.jsx';
import ScenarioEvalButton   from './ScenarioEvalButton.jsx';
import ScenarioDeleteButton from './ScenarioDeleteButton.jsx';

import EvalCom              from './EvalCom.jsx';
import EvalButton           from './EvalButton.jsx';

import api                  from '../../../api_routes.js';
import Message              from '../Message.jsx';

import config               from '../../../config/config.js';
import DocumentTitle        from 'react-document-title';

import Feedback             from './Feedback.jsx';
import ScenarioRating       from './ScenarioRating.jsx';

import UserIsCreatorMixin   from '../UserIsCreatorMixin.jsx';
import UserIsLoggedInMixin  from './../UserIsLoggedInMixin.jsx';

import I18nMixin            from '../i18n/I18nMixin.jsx';

var ScenarioView = React.createClass({
  mixins: [Router.Navigation, UserIsCreatorMixin, UserIsLoggedInMixin, I18nMixin],
  getInitialState: function() {
    return null;
  },
  componentDidMount: function() {

    var url = api.reverse('scenario_by_uuid', { uuid : this.props.params.uuid });
    var showEval = null;

    $.ajax({
      dataType: 'json',
      url: url,
      success: (scenario) => {
        if (this.isMounted()) {
          this.setState(scenario);
        }
      },
      error: (jqXHR, textStatus, errorThrown) => {
        this.setState({
          error: jqXHR
        });
      }
    });
  },
  render: function() {
    if (this.state === null) {
      return null;
    }

    if (this.state.error) {
      var message = (this.state.error.status + ': ' + this.state.error.statusText);
      return (<Message type="danger" message={message} />);
    }

    var starRating = <div className="row">
      <div className="oc-macro-content">
        <div className="oc-article-star-rating-wrapper">
          <div className="col-md-12">
            <h4 className="oc-bold">{this.i18n('how_interesting', 'How interesting is this scenario for you?')}</h4></div>
          <div className="col-md-12">
            <ScenarioRating
              scenario={this.state}
              enabled={true}
              className={"oc-article-rate-star"} />
          </div>
        </div>
      </div>
    </div>;

    if(this.userIsCreator(this.state)) {
      starRating = null;
    }

    return (
      <div>
        <DocumentTitle title={config.title + ' | ' + this.i18n('scenario', 'Scenario') + ' | ' + this.state.title} />
        <div className="row">
          <ScenarioTableView scenario={this.state} />

        </div>
        {this.userIsLoggedIn() ? starRating : starRating}
        <Feedback scenario={this.state} evaluations={typeof userEvaluations === 'undefined' ? null : userEvaluations}></Feedback>
        <div className="row">
          <div className="form-group">
            <div className="oc-macro-content oc-scenario-controls">
              <div className="col-sm-4"><ScenarioEditButton scenario={this.state}/></div>
              <div className="col-sm-4">

              </div>
              <div className="col-sm-4"><ScenarioDeleteButton scenario={this.state}/></div>
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
