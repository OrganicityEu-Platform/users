import $                    from 'jquery';
import React                from 'react';
import Router               from 'react-router';
import ReactDisqusThread    from 'react-disqus-thread';

import ReportTableView      from './ReportTableView.jsx';

// import ScenarioEditButton   from './ScenarioEditButton.jsx';
// import ScenarioEvalButton   from './ScenarioEvalButton.jsx';
// import ScenarioDeleteButton from './ScenarioDeleteButton.jsx';

import api                  from '../../../api_routes.js';
import Message              from '../Message.jsx';

var ReportView = React.createClass({
  mixins: [Router.Navigation],
  getInitialState: function() {
    return null;
  },
  componentDidMount: function() {
    var url = api.reverse('report_by_uuid', { uuid : this.props.params.uuid });

    $.ajax({
      dataType: 'json',
      url: url,
      success: (report) => {
        if (this.isMounted()) {
          this.setState(report);
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

    return (
      <div>
        <div className="row">
          <ReportTableView report={this.state} />
        </div>
        <div className="row">
          <div className="form-group">
            <div className="col-md-2 col-md-offset-5">
              { /* TODO
              <ScenarioEvalButton scenario={this.state}/>
              <ScenarioEditButton scenario={this.state}/>
              <ScenarioDeleteButton scenario={this.state}/>
              */}
            </div>
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

export default ReportView;
