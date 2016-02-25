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
      evaluations: null,
      show: false,
      evaluated: false,
      showEvalText: this.props.showEvalText ? this.props.showEvalText : false
    };
  },
  componentDidMount: function() {
    if(this.userIsLoggedIn()) {
      this.state.show = true;
      this.getUserEvaluations();
      this.setState(this.state);
    }
  },
  getUserEvaluations: function() {

    var url = api.reverse('evaluation_by_user', { uuid : currentUser.uuid });

    $.ajax(url, {
      dataType: 'json',
      success : (data) => {
        var e;
        for(e = 0; e < data.length; e++) {
          if(data[e].uuid === this.state.scenario.uuid && data[e].version === this.state.scenario.version){
            this.state.evaluated = true;
            this.setState(this.state);
          }
        }
      }
    });

  },
  render: function() {

    var userHasEvaluated = <span>you have evaluated this scenario.</span>;
    var userHasNotEvaluated = <span>you have not evaluated this scenario yet.</span>;

    if(this.state.show && !this.userIsCreator(this.state.scenario)) {
      if (this.state.evaluated) {
        return (
          <div>
            <div id="scenarioIndicator">
              <i className="fa fa-check-square-o pink"></i>
              {this.state.showEvalText ? userHasEvaluated : null}
            </div>
          </div>
        );
      }else {
        return (
          <div>
            <div id="scenarioIndicator">
              <i className="fa fa-check-square-o gray"></i>
              {this.state.showEvalText ? userHasNotEvaluated : null}
            </div>
          </div>
        );
      }
    }else {
      return null;
    }
  }
});

export default ScenarioIdicator;
