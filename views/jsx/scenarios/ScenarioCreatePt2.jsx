import React from 'react';
var Router = require('react-router');

var ScenarioCreatePt2 = React.createClass({
  mixins : [Router.Navigation],
  getInitialState: function () {
    var state = window.localStorage && window.localStorage.ocScenarioCreate ?
      JSON.parse(window.localStorage.ocScenarioCreate) : {
        title : '',
        summary : '',
        narrative : '',
        sectors : [],
        actors : [],
        devices : []
      };
    if (!state.sectors) {
      state.sectors = [];
    }
    state.sectorsString = state.sectors.join(",");
    return state;
  },
  handleChangedSectors : function(evt) {
    this.state.sectorsString = evt.target.value;
    this.setState(this.state);
  },
  clickedPrevious : function() {
    window.localStorage.ocScenarioCreate = JSON.stringify(this.state);
    this.transitionTo('scenarioCreatePt1');
  },
  clickedNext : function() {
    this.state.sectors = this.state.sectorsString.split(",").map((s) => s.trim()).filter((s) => s.length > 0);
    this.setState(this.state);
    window.localStorage.ocScenarioCreate = JSON.stringify(this.state);
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
            <td><input type="text" name="sectors" id="sectors" value={this.state.sectorsString} onChange={this.handleChangedSectors} /></td>
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
