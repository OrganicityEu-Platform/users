import $                from 'jquery';
import React            from 'react';
import ReactMixin       from 'react-mixin';
import Router           from 'react-router';

import LoadingMixin     from '../LoadingMixin.jsx';

import api              from '../../../api_routes.js';
import ui               from '../../../ui_routes.js';

import Message          from '../Message.jsx';

var ScenarioEvalView = React.createClass({
  mixins: [LoadingMixin, Router.Navigation],
  // scenario{uuid,version},submitted,[answers{question{...},answer{value,weight}}]
  getInitialState: function() {
    return {
      questionnaire: null,
      evaluation: {
        scenario: {
          uuid : this.props.params.uuid,
          version : this.props.query.version
        },
        submitted: false,
        answers: []
      },
      submitted: false
    };
  },
  componentWillMount: function() {
    this.loading();
  },
  componentDidMount: function() {
    var url = api.reverse('questionnaire');
    $.ajax(url, {
      error: this.loadingError(url, 'Error while loading evaluation questionnaire'),
      success: (questionnaire) => {
        // copy questions from questionnaire to evaluation answers
        questionnaire.questions.forEach((question) => {
          this.state.evaluation.answers.push({
            question : question
          });
        });
        this.loaded({ questionnaire : questionnaire,  evaluation : this.state.evaluation });
      }
    });
  },
  clickedTech: function(tech) {

    return () => {
      var params = {
        uuid : this.props.params.uuid
      };
      var query  = {
        version : this.props.query.version,
        tech : tech
      };
      this.transitionTo(ui.reverse('scenarioEvalView', params, query));
    };
  },
  selectedAnswer: function(questionIndex, answerIndex) {
    return () => {
      this.state.evaluation.answers[questionIndex].answer =
        this.state.questionnaire.questions[questionIndex].values[answerIndex];
    };
  },
  sendEvaluation: function() {
    this.state.evaluation.submitted = true;
    this.loading();
    var url = api.reverse('evaluations_list');
    $.ajax(url, {
      method: 'POST',
      dataType: 'json',
      data: this.state.evaluation,
      error: this.loadingError(url, 'Error while submitting questionnaire'),
      success: () => {
        this.loaded({ submitted : true });
      }
    });
  },
  handleGoBack : function(evt) {
    this.transitionTo('scenarioView', {
      uuid : this.props.params.uuid
    });
  },
  render: function() {

    if (this.isLoading()) {
      return (
        <div>Loading...</div>
      );
    }

    if (this.state.submitted) {
      return (
        <div className="col-lg-8 col-lg-offset-2">
          <Message type="success" message="Thank you!" />
          <button type="submit" className="oc-button" onClick={this.handleGoBack}>
            Back to the scenario
          </button>
        </div>
      );
    }

    if (!this.props.query.tech) {
      return (
        <div className="col-lg-8 col-lg-offset-2">
          Are you a...<br/>
          <button type="button"
            className="oc-button"
            onClick={this.clickedTech(true)}>
            Technical Person
          </button>
          <button type="button"
            className="oc-button"
            onClick={this.clickedTech(false)}>
            Non-Technical Person
          </button>
        </div>
      );
    }

    //Questionnaire > version, description, [questions{tech,text,[values{value,weight}]}]
    //Evaluation    > scenario{uuid,version},submitted,[answers{question{...},answer{value,weight}}]

    return (
      <div className="col-lg-8 col-lg-offset-2 oc-evaluation-div">
        <form>
          <div className="oc-evaluation-description-div col-lg-12">
            {this.state.questionnaire.description}
          </div>
          <div className="oc-evaluation-table-div">
            <div className="row oc-radios-wrapper">

              {this.state.questionnaire.questions.map((q, qIdx) =>
                q.tech !== (this.props.query.tech === 'true') ? [] : [
                  <div key={'question_' + qIdx + '_radios'}>
                    <div className="oc-evaluation-question col-lg-6">{q.text}</div>
                    {q.values.map((a, aIdx) => (
                      <div className="oc-evaluation-answer-radio col-lg-1">
                        <input type="radio"
                          className="form-control"
                          name={'question_' + qIdx}
                          id={'question_' + qIdx + '_answer_' + aIdx}
                          onClick={this.selectedAnswer(qIdx, aIdx)}
                        />
                        <label className="radio-label" htmlFor={'question_' + qIdx + '_answer_' + aIdx}>
                          <span className="oc-evaluation-answer-radio-num">{a.value}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                ]
              )}
            </div>
          </div>
          <div className="oc-evaluation-sendbutton-div">
            <button
              type="button"
              className="oc-button"
              onClick={this.sendEvaluation}
            >
                Send Evaluation
            </button>
          </div>
        </form>
      </div>
    );
  }
});

export default ScenarioEvalView;
