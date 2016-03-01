import $            from 'jquery';
import React        from 'react';
import LoadingMixin from './LoadingMixin.jsx';
import api          from '../../api_routes.js';

import config             from '../../config/config.js';
import DocumentTitle      from 'react-document-title';

var SysInfo = React.createClass({
  mixins : [LoadingMixin],
  getInitialState : function() {
    return { sysinfo : null };
  },
  componentDidMount: function() {
    this.loading();
    $.ajax(api.route('sysinfo'), {
      dataType : 'json',
      error : this.loadingError(api.route('sysinfo'), 'Error fetching sysinfo'),
      success : (sysinfo) => {
        this.loaded({ sysinfo : sysinfo });
      }
    });
  },
  render : function() {
    return (
      <div className="row sysinfo">
        <DocumentTitle title={config.title + ' | Admin | System info'} />
        <div className="col-md-12">
          <h1>System Info</h1>
          <h2>Version Control Information</h2>
          <table>
            <thead>
              <tr>
                <th>Branch</th>
                <th>Revision (short)</th>
                <th>Revision (long)</th>
                <th>Tag</th>
              </tr>
              {(() => {
                if (this.isLoading() || this.state.sysinfo == null) {
                  return (
                    <tr>
                      <td colSpan="4">Loading...</td>
                    </tr>
                  );
                }
                return (
                  <tr>
                    <td>{this.state.sysinfo.branch}</td>
                    <td>{this.state.sysinfo.short}</td>
                    <td>{this.state.sysinfo.long}</td>
                    <td>{this.state.sysinfo.tag}</td>
                  </tr>
                );
              })()}
            </thead>
          </table>
        </div>
      </div>
    );
  }
});

export default SysInfo;
