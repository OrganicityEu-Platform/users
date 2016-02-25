import React                from 'react';
import $                    from 'jquery';
import api                  from '../../../api_routes.js';
import UserIsLoggedInMixin  from './../UserIsLoggedInMixin.jsx';

var ScenarioIdicator = React.createClass({
  mixins : [UserIsLoggedInMixin],
  getInitialState: function() {
    return {
      scenario_version: this.props.scenario_version ? this.props.scenario_version : null,
      scenario_uuid: this.props.scenario_uuid ? this.props.scenario_uuid : null,
      currentUser: null,
      isOwner: false,
      evaluations: null,
      show: false,
      evaluated: false
    };
  },
  componentDidMount: function() {
    this.setUser();
    this.userIsOwner();
  },
  getUserEvaluations: function() {
    var url = api.reverse('evaluation_by_user', { uuid : this.state.currentUser });
    $.ajax(url, {
      dataType: 'json',
      success : (data) => {
        var e;
        for(e = 0; e < data.length; e++) {
          if(data[e].uuid === this.state.scenario_uuid && data[e].version === this.state.scenario_version){
            this.state.evaluated = true;
            this.setState(this.state);
          }
        }
      }
    });
  },
  setUser: function(user) {
    if(this.userIsLoggedIn()) {
      this.state.currentUser = currentUser.uuid;
      this.state.show = true;
      this.setState(this.state);
      this.getUserEvaluations();
    }
  },
  userIsOwner: function(){

    var options = {
      creator : this.state.currentUser,
    };

    var url = api.reverse('scenario_list', options);

    $.ajax(url, {
      dataType : 'json',
      success : (scenarios) => {
        console.log("your scenarios: " + JSON.stringify(scenarios));
        var k;
        for(k = 0; k < scenarios.length; k++) {
          if (scenarios[k].uuid === this.state.scenario_uuid) {
            this.state.isOwner = true;
            this.setState(this.state);
          }
        }
      }
    });
  },
  render: function() {
    if(this.state.show) {

      if (this.state.evaluated) {
        return (
          <div>
            {this.state.isOwner ? <div>owner</div> : <div>not owner</div>}
            <i className="fa fa-star pink"></i>you have evaluated this scenario</div>

        );
      }else {
        return (
          <div>
            {this.state.isOwner ? <div>owner</div> : <div>not owner</div>}
            <i className="fa fa-star-o grey"></i>you have NOT evaluated this scenario</div>
        );
      }
    }else {
      return null;
    }
  }
});

export default ScenarioIdicator;
