import React                from 'react';
import $                    from 'jquery';
import api                  from '../../../api_routes.js';

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
    this.userHasEvaluated(this.state.evaluations);
  },
  userHasEvaluated: function(evaluations) {
    if (evaluations){
      var e;
      for(e = 0; e < evaluations.length; e++) {
        if(evaluations[e].uuid === this.state.scenario.uuid){
          this.state.evaluated = true;
        }
      }
    }
  },
  render: function() {
    if(this.userIsLoggedIn()){
      if(!this.state.evaluated) {return(<div>not evaluated</div>);}
      if(this.state.evaluated) {return(<div>evaluated this</div>);}
    }else {
      return null;
    }
  }
});

export default ScenarioIdicator;
