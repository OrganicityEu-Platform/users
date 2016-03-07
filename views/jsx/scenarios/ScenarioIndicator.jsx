import $                    from 'jquery';
import api                  from '../../../api_routes.js';
import React                from 'react';

import LoadingMixin         from '../LoadingMixin.jsx';
import UserIsLoggedInMixin  from './../UserIsLoggedInMixin.jsx';
import UserIsCreatorMixin   from '../UserIsCreatorMixin.jsx';

var ScenarioIdicator = React.createClass({
  mixins : [LoadingMixin, UserIsLoggedInMixin, UserIsCreatorMixin],
  getInitialState: function() {
    return {
      scenario: this.props.scenario ? this.props.scenario : null,
      showEvalText: this.props.showEvalText ? this.props.showEvalText : false,
      evaluations: this.props.evaluations ? this.props.evaluations : null,
      evaluated: false
    };
  },
  componentDidMount: function() {
    if(this.userHasEvaluated(this.state.evaluations)) {
      this.state.evaluated = true;
      this.setState(this.state);
    }
  },
  userHasEvaluated: function(evaluations) {
    if (evaluations){
      var e;
      for(e = 0; e < evaluations.length; e++) {
        if(evaluations[e].uuid === this.state.scenario.uuid){
          return true;
        }
      }
    }
  },
  render: function() {
    if(this.userIsLoggedIn()){
      var userHasEvaluated = <span>You have evaluated this scenario.</span>;
      var userHasNotEvaluated = <span>You have not evaluated this scenario yet.</span>;
      if(this.userIsCreator(this.state.scenario)) {return null;}
      if(!this.state.evaluated) {return(<div id="scenarioIndicator">
        <i className="fa fa-check-square-o"></i>
        {this.state.showEvalText ? userHasNotEvaluated : null}
      </div>);}
      if(this.state.evaluated) {return(<div id="scenarioIndicator">
        <i className="fa fa-check-square-o pink"></i>
        {this.state.showEvalText ? userHasEvaluated : null}
      </div>);}
    }else {
      return null;
    }
  }
});

export default ScenarioIdicator;
