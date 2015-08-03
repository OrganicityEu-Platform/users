import React from 'react';
var Router = require('react-router');

var ScenarioCreatePt4 = React.createClass({
  mixins : [Router.Navigation],
  getInitialState: function () {
    return window.localStorage && window.localStorage.ocScenarioCreate ?
      JSON.parse(window.localStorage.ocScenarioCreate) : {
        title : '',
        summary : '',
        narrative : ''
      };
  },
  clickedPrevious : function() {
    window.localStorage.ocScenarioCreate = JSON.stringify(this.state);
    this.transitionTo('scenarioCreatePt3');
  },
  clickedNext : function() {
    window.localStorage.ocScenarioCreate = JSON.stringify(this.state);
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
        <p>
          <button type="button" className="btn btn-default" onClick={this.clickedPrevious}>Previous</button>
          <button type="button" className="btn btn-default" onClick={this.clickedNext}>Next</button>
        </p>
      </div>
    )
  }
});

export default ScenarioCreatePt4;
