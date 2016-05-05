import $            from 'jquery';
import React        from 'react';
import LoadingMixin from './LoadingMixin.jsx';
import I18nMixin    from './i18n/I18nMixin.jsx';
import api          from '../../api_routes.js';

import config             from '../../config/config.js';
import DocumentTitle      from 'react-document-title';

var SysInfo = React.createClass({
  mixins : [LoadingMixin, I18nMixin],
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
    var title = config.title + ' | ' + this.i18n('Admin.admin', 'Admin') + ' | ' + this.i18n('Admin.system_info', 'System info');

    return (
      <div className="row sysinfo">
        <DocumentTitle title={title} />
        <div className="col-md-12">
          <h1>{this.i18n('Admin.system_info', 'System Info')}</h1>
          <h2>{this.i18n('Admin.version_control_info', 'Version Control Information')}</h2>
          <table>
            <thead>
              <tr>
                <th>{this.i18n('Admin.branch', 'Branch')}</th>
                <th>{this.i18n('Admin.revision_short', 'Revision (short)')}</th>
                <th>{this.i18n('Admin.revision_long', 'Revision (long)')}</th>
                <th>{this.i18n('Admin.tag', 'Tag')}</th>
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
