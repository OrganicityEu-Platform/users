import $      from 'jquery';
import api    from '../../../api_routes.js';
import React  from 'react';

import LoadingMixin         from '../LoadingMixin.jsx';
import UserIsCreatorMixin   from '../UserIsCreatorMixin.jsx';
import UserIsLoggedInMixin  from './../UserIsLoggedInMixin.jsx';

var Feedback = React.createClass({
  mixins : [LoadingMixin, UserIsLoggedInMixin, UserIsCreatorMixin],
  getInitialState: function() {
    return {
      show: true,
      hasEvaluated: false,
      evaluations: this.props.evaluations ? this.props.evaluations : null,
      scenario: this.props.scenario ? this.props.scenario : null,
      likeText: null,
      dislikeText: null
    };
  },
  componentWillMount: function() {
    if(this.userHasEvaluated(this.state.evaluations)) {
      this.setState({hasEvaluated: true});
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
  handleLikeTextChange: function(evt) {
    this.setState({likeText: evt.target.value});
  },
  handleDislikeTextChange: function(evt) {
    this.setState({dislikeText: evt.target.value});
  },
  handleSubmit: function() {
    var url = api.reverse("feedback_list");
    var feedback = {
      user: currentUser ? currentUser.uuid : "Anonymous",
      like: this.state.likeText,
      dislike: this.state.dislikeText,
      scenario: {
        uuid: this.state.scenario.uuid,
        version: this.state.scenario.version
      }
    };
    $.ajax(url, {
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(feedback),
      method: 'POST',
      error : (xhr, textStatus, errorThrown) => {
        console.log(errorThrown);
      }
    });
  },
  render: function() {

    var likeText = "What do you like about this scenario?";
    var dislikeText = "What don't you like about this scenario?";

    if(this.userIsCreator(this.state.scenario)) {return(<div>you are owner</div>);}
    if(this.state.hasEvaluated){return(<div>you have evaluated</div>);}
    if(this.state.show) {
      return(
        <div className="oc-macro-content">
          <span>{likeText}</span>
          <textarea className="oc-input"
            onChange={this.handleLikeTextChange}></textarea>
          <span>{dislikeText}</span>
          <textarea className="oc-input"
            onChange={this.handleDislikeTextChange}></textarea>
          <div className="col-md-4 col-md-offset-4">
            <button className="oc-button"
              onClick={() => this.handleSubmit()}>SEND FEEDBACK</button>
          </div>
        </div>
      );
    }
  }
});

export default Feedback;
