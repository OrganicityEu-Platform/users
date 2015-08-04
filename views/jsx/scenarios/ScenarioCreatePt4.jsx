import React from 'react';
var Router = require('react-router');
import TagField from '../form-components/TagField.jsx';
import ScenarioCreateMixin from './ScenarioCreateMixin.jsx';

var ScenarioCreatePt4 = React.createClass({
  mixins : [Router.Navigation, ScenarioCreateMixin],
  handleChangedDevices : function(devices) {
    this.state.devices = devices;
    this.setState(this.state);
  },
  clickedPrevious : function() {
    this.saveState();
    this.transitionTo('scenarioCreatePt3');
  },
  clickedNext : function() {
    this.saveState();
    this.transitionTo('scenarioCreatePt5');
  },
  render: function () {
    return (
      <div className="row">
        <h2>Create your scenario <small>step four</small></h2>
        <h3>Select the Device(s)!</h3>
        <p>
          Curabitur blandit tempus porttitor. Praesent commodo cursus magna, vel scelerisque nisl
          consectetur et. Donec sed odio dui.
        </p>
        <table>
          <tr>
            <th>Devices</th>
            <td><TagField tags={this.state.devices} onChange={this.handleChangedDevices} /></td>
          </tr>
        </table>
        <p>
          <button type="button" className="btn btn-default" onClick={this.clickedPrevious}>Previous</button>
          <button type="button" className="btn btn-default" onClick={this.clickedNext}>Next</button>
        </p>
      </div>
    )
  }
});

export default ScenarioCreatePt4;
