import React from 'react';
var Router = require('react-router');

var ScenarioCreatePt5 = React.createClass({
  mixins : [Router.Navigation],
  getInitialState: function () {
    return window.localStorage && window.localStorage.ocScenarioCreate ?
      JSON.parse(window.localStorage.ocScenarioCreate) : {
        title : '',
        summary : '',
        narrative : '',
        sectors : [],
        actors : [],
        devices : []
      };
  },
  clickedPrevious : function() {
    window.localStorage.ocScenarioCreate = JSON.stringify(this.state);
    this.transitionTo('scenarioCreatePt4');
  },
  clickedNext : function() {
    window.localStorage.ocScenarioCreate = JSON.stringify(this.state);
    alert('submitted');
  },
  render: function () {
    return (
      <div className="row">
        <h2>Create your scenario <small>step five</small></h2>
        <h3>Here's your story!</h3>
        <p>
          Donec id elit non mi porta gravida at eget metus. Donec ullamcorper nulla non metus auctor
          fringilla.
        </p>
        <p>
          <button type="button" className="btn btn-default" onClick={this.clickedPrevious}>Previous</button>
          <button type="button" className="btn btn-default" onClick={this.clickedSubmit}>Submit</button>
        </p>
      </div>
    )
  }
});

export default ScenarioCreatePt5;
