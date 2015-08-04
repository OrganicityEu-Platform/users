import React from 'react';
var Router = require('react-router');
import TagField from '../form-components/TagField.jsx';

var ScenarioCreatePt2 = React.createClass({
  mixins : [Router.Navigation],
  getInitialState: function () {
    if (window.localStorage && window.localStorage.ocScenarioCreate) {
      return JSON.parse(window.localStorage.ocScenarioCreate);
    }
    return {
      title : '',
      summary : '',
      narrative : '',
      sectors : [],
      actors : [],
      devices : []
    };
  },
  handleChangedSectors : function(sectors) {
    this.state.sectors = sectors;
    this.setState(this.state);
  },
  saveState : function() {
    window.localStorage.ocScenarioCreate = JSON.stringify(this.state);
  },
  clickedPrevious : function() {
    this.saveState();
    this.transitionTo('scenarioCreatePt1');
  },
  clickedNext : function() {
    this.saveState();
    this.transitionTo('scenarioCreatePt3');
  },
  render: function () {
    return (
      <div className="row">
        <h2>Create your scenario <small>step two</small></h2>
        <h3>Select the Sector(s)!</h3>
        <p>
          Donec sed odio dui. Maecenas sed diam eget risus varius blandit sit amet non magna.
        </p>
        <table>
          <tr>
            <th>Sectors</th>
            <td><TagField tags={this.state.sectors} onChange={this.handleChangedSectors} /></td>
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

export default ScenarioCreatePt2;
