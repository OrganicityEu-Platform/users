import React  from 'react';
import ReportThumbnail  from './ReportThumbnail.jsx';

// FIXME: move to less
var reportsCounterStyle = {
  textAlign: 'center'
};

var ReportThumbnails = React.createClass({

  render: function() {

    if (!this.props.reports) {
      return null;
    }

    var counter = null;
    if (this.props.counter) {
      counter = (
        <div style={reportsCounterStyle}>
          Reports: {this.props.reports.length}
        </div>
      );
    }

    return (
      <div>
      {counter}
        <div className="row scenario-thumbnails">
        {
          this.props.reports.map(
            (report) => <ReportThumbnail key={report.uuid} report={report} onChange={this.reload}/>
          )
        }
        </div>
      </div>
    );
  }
});

export default ReportThumbnails;
