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
      show: false,
      showEvalText: this.props.showEvalText ? this.props.showEvalText : false,
      evaluated: false
    };
  },
  componentWillMount: function() {

      this.state.show = true;
      this.getUserEvaluations();
      this.setState(this.state);

  },
  componentDidMount: function() {
      if(this.userIsCreator(this.state.scenario)) {
        this.state.show = false;
        this.setState(this.state);
      }
  },
  userHasEvaluated: function(value) {
    this.setState({evaluated: value});
  },
  getUserEvaluations: function() {
    if(this.userIsLoggedIn()) {
      var url = api.reverse('evaluation_by_user', { uuid : currentUser.uuid });

      $.ajax(url, {
        dataType: 'json',
        success : (data) => {
          var e;
          for(e = 0; e < data.length; e++) {
            if(data[e].uuid === this.state.scenario.uuid && data[e].version === this.state.scenario.version){
              this.userHasEvaluated(true);
              break;
            }
          }
        },
        error : (xhr, textStatus, errorThrown) => {
          if (xhr.status === 401) {

          } else {
            this.flashOnAjaxError(url, 'Error retrieving evaluated scenarios for current user')(xhr, textStatus, errorThrown);
          }
        }
      });
    }
  },
  render: function() {

    var userHasEvaluated = <span>you have evaluated this scenario.</span>;
    var userHasNotEvaluated = <span>you have not evaluated this scenario yet.</span>;

    if(this.userIsLoggedIn() && this.state.show) {
      if (this.state.evaluated) {
        return (
          <div>
            <div id="scenarioIndicator">
              <i className="fa fa-check-square-o pink"></i>

            </div>
          </div>
        );
      }else {
        return (
          <div>
            <div id="scenarioIndicator">
              <i className="fa fa-check-square-o gray"></i>

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
