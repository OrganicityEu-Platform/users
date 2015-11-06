import $                    from 'jquery';
import React                from 'react';
import Router               from 'react-router';
import ReactDisqusThread    from 'react-disqus-thread';

import ScenarioTableView    from './ScenarioTableView.jsx';
import ScenarioEditButton   from './ScenarioEditButton.jsx';
import ScenarioEvalButton   from './ScenarioEvalButton.jsx';
import ScenarioDeleteButton from './ScenarioDeleteButton.jsx';
import api                  from '../../../api_routes.js';
import Message              from '../Message.jsx';

var ScenarioView = React.createClass({
  mixins: [Router.Navigation],
  getInitialState: function() {
    return null;
  },
  componentDidMount: function() {
    var url = api.reverse('scenario_by_uuid', { uuid : this.props.params.uuid });

    $.ajax({
      dataType: 'json',
      url: url,
      success: (scenario) => {
        if (this.isMounted()) {
          console.log('Scenario', scenario);
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
  clickedEvaluate: function() {
    this.transitionTo('scenarioEvalView', { uuid : this.props.params.uuid }, { version : this.state.version });
  },
  render: function() {
    if (this.state === null) {
      return null;
    }

    if (this.state.error) {
      var message = (this.state.error.status + ': ' + this.state.error.statusText);
      return (<Message type="danger" message={message} />);
    }

    return (
      <div>
        <div className="row">
          <ScenarioTableView scenario={this.state} />
        </div>
        <div className="row">
          <div className="oc-scenario-controls">
            <ScenarioEditButton scenario={this.state}/>
            <ScenarioDeleteButton scenario={this.state}/>
          </div>
        </div>
        <div className="col-lg-8 col-lg-offset-2">
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
