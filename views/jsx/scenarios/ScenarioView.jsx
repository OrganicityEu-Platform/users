import $                    from 'jquery';
import React                from 'react';
import Router               from 'react-router';
import ReactDisqusThread    from 'react-disqus-thread';

import ScenarioTableView    from './ScenarioTableView.jsx';

import ScenarioEditButton   from './ScenarioEditButton.jsx';
import ScenarioEvalButton   from './ScenarioEvalButton.jsx';
import ScenarioDeleteButton from './ScenarioDeleteButton.jsx';

import LoadingMixin         from '../LoadingMixin.jsx';

import api                  from '../../../api_routes.js';
import Message              from '../Message.jsx';

var ScenarioView = React.createClass({
  mixins: [Router.Navigation, LoadingMixin],
  getInitialState: function() {
    return null;
  },
  componentDidMount: function() {
    this.getLastVersion();
  },
  getLastVersion : function() {
    var url = api.reverse('scenario_by_uuid', { uuid : this.props.params.uuid });
    $.ajax({
      dataType: 'json',
      url: url,
      success: (scenario) => {
        if (this.isMounted()) {
          //console.log('Scenario', scenario);
          this.setState({scenario: scenario});
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
    if(this.state.scenario.version == 1) {
      this.loadingSuccess("Delete scenario successful!");
      this.transitionTo('scenarioList');
    } else {
      this.loadingSuccess("Undo scenario successful!");
      this.getLastVersion(); // Force reload
    }
  },
  render: function() {

    if (this.state.error) {
      var message = (this.state.error.status + ': ' + this.state.error.statusText);
      return (<Message type="danger" message={message} />);
    }

    if(!this.state.scenario) {
      return null;
    }

    return (
      <div>
        <div className="row">
          <ScenarioTableView scenario={this.state.scenario} />
        </div>
        <div className="row">
          <div className="form-group">
            <div className="oc-macro-content">
              <div className="col-sm-4"><ScenarioEditButton scenario={this.state.scenario}/></div>
              <div className="col-sm-4"><ScenarioEvalButton scenario={this.state.scenario}/></div>
              <div className="col-sm-4"><ScenarioDeleteButton scenario={this.state.scenario} onChange={this.handleDelete}/></div>
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
