import React from 'react';
import QuestionnaireValuesEditView from './QuestionnaireValuesEditView.jsx';

var QuestionnaireQuestionsEditView = React.createClass({
  getInitialState: function() {
    return {
      questions : this.props.questions
    };
  },
  handleChangedQuestionText: function(questionIndex) {
    return (evt) => {

      this.state.questions[questionIndex].text = evt.target.value;
      this.props.onChange(this.state.questions);
    };
  },
  handleChangedValues: function(questionIndex) {
    return (values) => {
      this.state.questions[questionIndex].values = values;
      this.props.onChange(this.state.questions);
    };
  },
  handleChangedTech: function(questionIndex) {
    return (evt) => {
      //console.log('check box handler' +  event.target.checked);
      this.state.questions[questionIndex].tech = event.target.checked ;
      this.props.onChange(this.state.questions);
    };
  },
  onAddQuestion: function(question) {
    this.state.questions.push({
      tech : false,
      text : "QUESTION TEXT",
      values : [{
        value  : 'VALUE TEXT',
        weight : 0
      }]
    });
    this.props.onChange(this.state.questions);
  },
  onDelQuestion: function(question) {
    this.state.questions = this.state.questions.slice(0, this.state.questions.length - 1);
    this.props.onChange(this.state.questions);
  },
  render: function() {
    return (
      <div>
        <div className="row pull-right">
          <button
            type="button"
            className="btn btn-default"
            onClick={this.onAddQuestion}> + </button>
          <button
            type="button"
            className="btn btn-default"
            onClick={this.onDelQuestion}
            disabled={this.state.questions.length <= 1 ? 'disabled' : ''}> - </button>
        </div>
        <div className="row">

          {(() => {
            return this.state.questions.map((q, index) => {
              return (
                <div key={"question_" + index}>
                  <div className="form-group">
                    <label
                      className="control-label col-sm-2"
                      htmlFor={"question_"+index+"_tech"}>Technical</label>
                    <div className="col-sm-8">
                      <input
                        type="checkbox"
                        id={"question_"+index+"_tech"}
                        name={"question_"+index+"_tech"}
                        value={q.tech}
                        checked={q.tech}
                        onChange={this.handleChangedTech(index)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label
                      className="control-label col-sm-2"
                      htmlFor={"question_"+index+"_text"}>
                        Question {index+1}
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control"
                        name={"question_"+index+"_text"}
                        id={"question_"+index+"_text"}
                        value={q.text}
                        onChange={this.handleChangedQuestionText(index)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="control-label col-sm-2">Options</label>
                    <div className="col-sm-8">
                      <QuestionnaireValuesEditView
                        values={q.values}
                        question={index}
                        handleChangedValues={this.handleChangedValues(index)}/>
                    </div>
                  </div>
                </div>
              );
            });
          })()}
        </div>
        
      </div>
    );
  }
});

export default QuestionnaireQuestionsEditView;
