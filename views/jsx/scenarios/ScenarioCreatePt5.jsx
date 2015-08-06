import React from 'react';
var Router = require('react-router');
import ScenarioTableView from './ScenarioTableView.jsx';
import $ from 'jquery';
import ScenarioCreateMixin from './ScenarioCreateMixin.jsx';
import FlashQueue from '../FlashQueue.jsx';
import api from '../../../api_routes.js';

var ScenarioCreatePt5 = React.createClass({
  mixins : [FlashQueue.Mixin, Router.Navigation, ScenarioCreateMixin],
  clickedPrevious : function() {
    this.saveState();
    this.transitionTo('scenarioCreatePt4');
  },
  clickedSubmit : function() {
    $.ajax(api.route('scenario_list'), {
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(this.state),
      method: 'POST',
      error: this.flashOnAjaxError(api.route('scenario_list'), 'Error while submitting new scenario'),
      success: (scenario) => {
        this.clearState();
        this.transitionTo('scenarioView', { uuid : scenario._id });
      }
    });
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
        <ScenarioTableView scenario={this.state} />
        <p>
          <button type="button" className="btn btn-default" onClick={this.clickedPrevious}>Previous</button>
          <button type="button" className="btn btn-default" onClick={this.clickedSubmit}>Submit</button>
        </p>
      </div>
    )
  }
});

export default ScenarioCreatePt5;
