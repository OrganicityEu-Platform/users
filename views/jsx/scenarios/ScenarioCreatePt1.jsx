import React from 'react';
var Router = require('react-router');

var ScenarioCreatePt1 = React.createClass({
  mixins : [Router.Navigation],
  getInitialState: function () {
    return window.localStorage && window.localStorage.ocScenarioCreate ?
      JSON.parse(window.localStorage.ocScenarioCreate) : {
        title : '',
        summary : '',
        narrative : ''
      };
  },
  handleChangedTitle : function(evt) {
    this.state.title = evt.target.value;
    this.setState(this.state);
  },
  handleChangedSummary : function(evt) {
    this.state.summary = evt.target.value;
    this.setState(this.state);
  },
  handleChangedNarrative : function(evt) {
    this.state.narrative = evt.target.value;
    this.setState(this.state);
  },
  clickedNext : function() {
    window.localStorage.ocScenarioCreate = JSON.stringify(this.state);
    this.transitionTo('scenarioCreatePt2');
  },
  render: function () {
    return (
      <div className="row">
        <h2>Create your scenario <small>step one</small></h2>
        <h3>Write your short story!</h3>
        <p>
          Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Aenean eu leo
          quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Integer posuere
          erat a ante venenatis dapibus posuere velit aliquet.
        </p>
        <table>
            <thead>
            <tr>
                <th>Title</th>
                <td><input type="text" name="title" id="title" value={this.state.title} onChange={this.handleChangedTitle} /></td>
            </tr>
            <tr>
                <th>Summary</th>
                <td><input type="text" name="summary" id="summary" value={this.state.summary} onChange={this.handleChangedSummary} /></td>
            </tr>
            <tr>
                <th>Narrative</th>
                <td><textarea name="narrative" id="narrative" value={this.state.narrative} onChange={this.handleChangedNarrative} /></td>
            </tr>
            <tr>
                <th></th>
                <td>
                  <button type="button" className="btn btn-default" onClick={this.clickedNext}>Next</button>
                </td>
            </tr>
            </thead>
        </table>
      </div>
    )
  }
});

export default ScenarioCreatePt1;
