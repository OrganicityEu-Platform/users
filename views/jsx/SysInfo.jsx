import $ from 'jquery';
import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { NavItemLink, ButtonLink, ListGroupItemLink } from 'react-router-bootstrap';
import FlashQueue from './FlashQueue.jsx';
import api from '../../api_routes.js';

var SysInfo = React.createClass({
  mixins : [FlashQueue.Mixin],
  getInitialState : function() {
    return null;
  },
  componentDidMount: function() {
    $.ajax(api.route('sysinfo'), {
      dataType : 'json',
      error : this.flashOnAjaxError(api.route('sysinfo'), 'Error fetching sysinfo'),
      success : (sysinfo) => {
        this.setState(sysinfo);
      }
    });
  },
  render : function() {
    return (
      <div className="row sysinfo">
        <div className="col-md-12">
          <h1>About</h1>
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
                if (this.state == null) {
                  return (
                    <tr>
                      <td colSpan="4">Loading...</td>
                    </tr>
                  );
                } else {
                  return (
                    <tr>
                      <td>{this.state.branch}</td>
                      <td>{this.state.short}</td>
                      <td>{this.state.long}</td>
                      <td>{this.state.tag}</td>
                    </tr>
                  );
                }
              })()}

            </thead>
          </table>
          <p>

          </p>
        </div>
      </div>
    );
  }
});

export default SysInfo;
