import $                    from 'jquery';
import React                from 'react';
import api                  from '../../../api_routes.js';

import UserIsLoggedInMixin  from './../UserIsLoggedInMixin.jsx';
import UserIsCreatorMixin   from '../UserIsCreatorMixin.jsx';
import LoadingMixin         from '../LoadingMixin.jsx';

var EvalButton = React.createClass({
  mixins : [LoadingMixin, UserIsLoggedInMixin, UserIsCreatorMixin],
  getInitialState: function () {
    return {
      scenario: this.props.scenario ? this.props.scenario : null,
      show: true,
      isOwner: false,
      hasEvaluated: false,
      allowMultipleEvals: this.props.allowMultipleEvals ? this.props.allowMultipleEvals : false,
      allowOwnerEvals: this.props.allowOwnerEvals ? this.props.allowOwnerEvals : false,
    };
  },
  componentDidMount: function () {

    if (this.userIsLoggedIn()) {
      this.userIsOwner();

      if(!this.state.allowMultipleEvals) {
        this.userHasEvaluated();
      }

    }

  },
  handleClick: function () {
    $("#oc-eval-button").click();
    this.state.show = false;
    this.setState(this.state);
  },
  userIsOwner: function(){

    if(this.userIsCreator(this.state.scenario)){
      this.state.show = false;
      this.state.isOwner = true;
      this.setState(this.state);
    }

  },
  userHasEvaluated: function () {

    var url = api.reverse('evaluation_by_user', { uuid : currentUser.uuid });

    $.ajax(url, {
      dataType: 'json',
      success : (data) => {
        var e;
        for(e = 0; e < data.length; e++) {
          if(data[e].uuid === this.state.scenario.uuid && data[e].version === this.state.scenario.version){
            this.state.hasEvaluated = true;
            this.setState(this.state);
          }
        }
      }
    });

  },
  render: function () {

    var button = <button
    className="oc-button"
    id="oc-eval-prim"
    onClick={() => this.handleClick()}
    >EVALUATE THIS SCENARIO</button>;

    if(this.userIsLoggedIn() && this.state.isOwner) {
      return (
        this.state.allowOwnerEvals ? button : null
      );
    }else if (this.userIsLoggedIn() && this.state.hasEvaluated){
      return (
        this.state.allowMultipleEvals ? button : null
      );
    }else {
      return(
        this.state.show ? button : null
      );
    }
  }
});

export default EvalButton;
