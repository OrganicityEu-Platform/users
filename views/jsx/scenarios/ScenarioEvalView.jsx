import $                from 'jquery';
import React            from 'react';
import ReactMixin       from 'react-mixin';
import Router           from 'react-router';

import LoadingMixin     from '../LoadingMixin.jsx';

import api              from '../../../api_routes.js';
import ui               from '../../../ui_routes.js';

import Message          from '../Message.jsx';

import FlashQueue           from '../FlashQueue.jsx';

import config             from '../../../config/config.js';
import DocumentTitle      from 'react-document-title';


var ScenarioEvalView = React.createClass({
  mixins: [LoadingMixin, Router.Navigation, FlashQueue.Mixin],
  // scenario{uuid,version},submitted,[answers{question{...},answer{value,weight}}]
  getInitialState: function() {
    return {
      questionnaire: null,
      evaluation: {
        scenario: {
          uuid : this.props.uuid,
          version : this.props.version
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
      error: this.loadingError(url, 'Please, fill in all the answers before submitting.'),
      success: () => {
        this.loaded({ submitted : true });
        $("#scenarioIndicator").html('<i class="fa fa-check-square-o pink"></i>you have evaluated this scenario');
        this.flash('success', 'Evaluation complete.', 10000);
      }
    });
  },
  handleGoBack : function(evt) {
    this.transitionTo('scenarioView', {
      uuid : this.props.uuid
    });
  },
  render: function() {
    if (this.isLoading()) {
      return this.renderLoading();
    }

    if (this.state.submitted) {
      return (
        null
      );
    }



    //Questionnaire > version, description, [questions{tech,text,[values{value,weight}]}]
    //Evaluation    > scenario{uuid,version},submitted,[answers{question{...},answer{value,weight}}]

    return (
      <div className="col-lg-8 col-lg-offset-2 oc-evaluation-div">
        <DocumentTitle title={config.title + ' | Scenario Evaluation'} />
        <form>
          <div className="oc-evaluation-description-div col-lg-12">
            {this.state.questionnaire.description}
          </div>
          <div className="oc-evaluation-table-div">
            <div className="row oc-radios-wrapper">
              {this.state.questionnaire.questions.map((q, qIdx) =>
                q.tech !== (this.props.tech === 'true') ? [] : [
                  <div className="oc-eval-question col-lg-12" key={'question_' + qIdx + '_radios'}>
                    <div className="oc-evaluation-question">
                    {q.text}</div>
                    <div className="oc-eval-answers-wrapper col-lg-12">
                    {q.values.map((a, aIdx) => (
                      <div className="oc-evaluation-answer-radio">
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
