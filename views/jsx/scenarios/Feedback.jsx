import $                    from 'jquery';
import ui                   from '../../../ui_routes.js';
import api                  from '../../../api_routes.js';
import React                from 'react';
import ValidationIndicator  from '../ValidationIndicator.jsx'

import FlashQueue           from '../FlashQueue.jsx';
import LoadingMixin         from '../LoadingMixin.jsx';
import UserHasRoleMixin     from '../UserHasRoleMixin.jsx';
import UserIsCreatorMixin   from '../UserIsCreatorMixin.jsx';
import UserIsLoggedInMixin  from './../UserIsLoggedInMixin.jsx';
import I18nMixin            from '../i18n/I18nMixin.jsx';


var Feedback = React.createClass({
  mixins : [UserHasRoleMixin, LoadingMixin, UserIsLoggedInMixin, UserIsCreatorMixin, FlashQueue.Mixin, I18nMixin],
  getInitialState: function() {
    return {
      show: true,
      hasEvaluated: false,
      evaluations: this.props.evaluations ? this.props.evaluations : null,
      scenario: this.props.scenario ? this.props.scenario : null,
      likeText: null,
      dislikeText: null,
      userFeedback: []
    };
  },
  componentWillMount: function() {
    if(this.userHasEvaluated(this.state.evaluations)) {
      this.setState({hasEvaluated: true});
    }
  },
  componentDidMount: function() {
    if(this.userIsCreator(this.state.scenario)) {
      this.loadUserFeedback();
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
  loadUserFeedback: function() {
    var url = api.reverse('feedback_by_scenario', { uuid : this.state.scenario.uuid });
    $.ajax(url, {
      dataType: 'json',
      success : this.handleUserFeedback
    });
  },
  handleUserFeedback: function(feedback){
    var e;
    for(e = 0; e < feedback.length; e++) {
      var tick = {
        user: feedback[e].user,
        like: feedback[e].like,
        dislike: feedback[e].dislike
        // TODO: add timestamp in api
      };
      var tock =
      <div>
        <span className="oc-feedback-user-label">
          <span className="pink">
            {feedback[e].user}
          </span>
          <span> said</span>
        </span>

        <p>
          <img
            className="oc-feedback-arrow"
            src={ui.asset('static/img/icon-09.png')}/>
          {feedback[e].like}
        </p>
        <p>
          <img
            className="oc-feedback-arrow"
            src={ui.asset('static/img/icon-10.png')}/>
          {feedback[e].dislike}
        </p>
      </div>
      ;
      this.state.userFeedback.push(tock);
    }
    this.setState(this.state);
  },
  getUserFeedback: function() {
    return this.state.userFeedback.map(function(feedback, i){
      return <div>
        {feedback}
      </div>;
    }, this);
  },
  handleSubmit: function() {

    if(this.state.likeText && this.state.dislikeText) {
      if(this.state.likeText !== "" && this.state.dislikeText !== "") {
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
          },
          success: () => {
            this.setState({show: false});
            this.flash('success', 'Thank you for your feedback', 150000);
          }
        });
      }
    }
  },
  render: function() {

    var likeText = this.i18n('i_like', 'I like...');
    var dislikeText = this.i18n('i_dislike', 'I dislike...');

    if(this.userIsCreator(this.state.scenario) || this.userHasRole('admin')) {return(
      <div className="row">
        <div className="oc-macro-content">
          <div className="oc-feedback-wrapper">
            <h3>
              Feedback recieved
            </h3>
            <span>
              {this.getUserFeedback()}
            </span>
          </div>
        </div>
      </div>
    );}
    if(this.state.hasEvaluated){return(
      null
    );}
    if(this.state.show) {
      return(
        <div className="row">
          <div className="oc-macro-content">
            <div className="oc-feedback-wrapper">
              <div>
                <h3>
                  {this.i18n('eval_this_scenario', 'Evaluate this scenario')}
                </h3>
                </div>
                <form className="form-horizontal">
                  <div
                    className="form-group oc-form-group oc-edit-group"
                    id="oc-like-text-wrapper">
                    <label
                      className="control-label col-sm-3"
                      htmlFor="like">
                      <span className="oc-feedback-label-text">
                        <img
                          className="oc-feedback-label-icon"
                          src={ui.asset('static/img/oc-smiley.png')}/>
                        {likeText}
                      </span>
                    </label>
                    <div className="col-sm-9">
                      <textarea
                        name="like"
                        className="oc-input oc-feedback-text"
                        onChange={this.handleLikeTextChange}>
                      </textarea>
                    </div>
                  </div>
                  <div className="form-group oc-form-group oc-edit-group">
                    <label
                      className="control-label col-sm-3"
                      htmlFor="dislike">
                      <span className="oc-feedback-label-text">
                        <img
                          className="oc-feedback-label-icon"
                          src={ui.asset('static/img/oc-saddy.png')}/>
                        {dislikeText}
                      </span>
                    </label>
                    <div className="col-sm-9">
                      <textarea
                        name="dislike"
                        className="oc-input oc-feedback-text"
                        onChange={this.handleDislikeTextChange}>
                      </textarea>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="oc-macro-content">
              <div className="col-sm-4">
              </div>
              <div className="col-sm-4">
                <button
                  className="oc-button"
                  id="oc-submit-feedback"
                  onClick={() => this.handleSubmit()}>
                  SEND FEEDBACK
                </button>
              </div>
              <div className="col-sm-4">
              </div>
            </div>
          </div>
        );
      }
      if(!this.state.show) {
        return(
          null
        );
      }
    }
  });

  export default Feedback;
