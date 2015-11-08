import $                from 'jquery';
import React            from 'react';
import ReactMixin       from 'react-mixin';
import Router           from 'react-router';

import LoadingMixin     from '../LoadingMixin.jsx';
import api              from '../../../api_routes.js';
import ui               from '../../../ui_routes.js';

var Navigation = Router.Navigation;

var ScenarioEvalView = React.createClass({
  mixins: [LoadingMixin, Navigation],
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
      var params = { uuid : this.props.params.uuid };
      var query  = { version : this.props.query.version, tech : tech };
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
  render: function() {

    if (this.isLoading()) {
      return (
        <div>Loading...</div>
      );
    }

    if (this.state.submitted) {
      return (
        <div className="col-lg-8 col-lg-offset-2">
          Thank you!
        </div>
      );
    }

    if (!this.props.query.tech) {
      return (
        <div className="col-lg-8 col-lg-offset-2">
          Are you a...<br/>
          <button type="button"
            className="btn btn-default"
            onClick={this.clickedTech(true)}>
            Technical Person
          </button>
          <button type="button"
            className="btn btn-default"
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
          <div className="oc-evaluation-description-div">
            {this.state.questionnaire.description}
          </div>
          <div className="oc-evaluation-table-div">
            <table>
              {this.state.questionnaire.questions.map((q, qIdx) =>
                q.tech !== (this.props.query.tech === 'true') ? [] : [
                  <tr key={"question_"+qIdx+"_headers"}>
                    <td>&nbsp;</td>
                    {q.values.map((a) => <td className="oc-evaluation-answer-text">{a.value}</td>)}
                  </tr>,
                  <tr key={"question_"+qIdx+"_radios"}>
                    <td className="oc-evaluation-question">{q.text}</td>
                    {q.values.map((a,aIdx) => (
                      <td className="oc-evaluation-answer-radio">
                        <input type="radio"
                          className="form-control"
                          name={"question_"+qIdx}
                          id={"question_"+qIdx+"_answer_"+aIdx}
                          onClick={this.selectedAnswer(qIdx, aIdx)} />
                      </td>
                    ))}
                  </tr>
                ]
              )}
            </table>
          </div>
          <div className="oc-evaluation-sendbutton-div">
            <button type="button" className="btn btn-primary" onClick={this.sendEvaluation}>Send Evaluation</button>
          </div>
        </form>
      </div>
    );
  }
});

export default ScenarioEvalView;
