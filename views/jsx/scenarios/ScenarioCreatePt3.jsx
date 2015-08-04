import React from 'react';
var Router = require('react-router');
import TagField from '../form-components/TagField.jsx';
import ScenarioCreateMixin from './ScenarioCreateMixin.jsx';

var ScenarioCreatePt3 = React.createClass({
  mixins : [Router.Navigation, ScenarioCreateMixin],
  handleChangedActors : function(actors) {
    this.state.actors = actors;
    this.setState(this.state);
  },
  clickedPrevious : function() {
    this.saveState();
    this.transitionTo('scenarioCreatePt2');
  },
  clickedNext : function() {
    this.saveState();
    this.transitionTo('scenarioCreatePt4');
  },
  render: function () {
    return (
      <div className="row">
        <h2>Create your scenario <small>step three</small></h2>
        <h3>Select the Actor(s)!</h3>
        <p>
          Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum
          massa justo sit amet risus. Sed posuere consectetur est at lobortis. Morbi leo risus,
          porta ac consectetur ac, vestibulum at eros. Cras justo odio, dapibus ac facilisis in,
          egestas eget quam.
        </p>
        <table>
          <tr>
            <th>Actors</th>
            <td><TagField tags={this.state.actors} onChange={this.handleChangedActors} /></td>
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

export default ScenarioCreatePt3;
