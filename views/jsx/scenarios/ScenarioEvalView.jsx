import $                from 'jquery';
import React            from 'react';
import ReactMixin       from 'react-mixin';
import Router           from 'react-router';

import LoadingMixin     from '../LoadingMixin.jsx';
import api              from '../../../api_routes.js';

var ScenarioEvalView = React.createClass({
  mixins: [LoadingMixin],
  // scenario{uuid,version},submitted,[answers{question{...},answer{value,weight}}]
  getInitialState: function() {
    return {
      questionnaire: null,
      tech: null,
      techSelected: false,
      evaluation: {
        scenario: {
          uuid : null,
          version : null
        },
        submitted: false,
        answers: []
      }
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
        this.loaded({ questionnaire : questionnaire });
      }
    });
  },
  clickedTech: function(tech) {
    return () => {
      this.setState({tech: tech, techSelected: true});
    };
  },
  render: function() {

    if (this.isLoading()) {
      return (
        <div>Loading...</div>
      );
    }

    if (!this.state.techSelected) {
      return (
        <div className="row col-sm-12">
          Are you a...<br/>
          <button type="button"
            className="btn btn-default"
            onClick={this.clickedTech(true)}>
            Technical Person
          </button>
          <button type="button"
            className="btn btn-default"
            onClick={this.clickedTech(true)}>
            Non-Technical Person
          </button>
        </div>
      );
    }

    // version, description, [questions{tech,text,[values{value,weight}]}]
    // scenario{uuid,version},submitted,[answers{question{...},answer{value,weight}}]
    return (
      <form className="form-horizontal">
        <div className="form-group col-sm-12">Description: {this.state.questionnaire.description}</div>
        {(() => {
          return this.state.questionnaire.questions.filter((q) => q.tech === this.state.tech).map((q, qIdx) => {
            return (
              <div key={"question_"+qIdx}>
                <div className="form-group">
                  <div className="col-sm-2"></div>
                  <div className="col-sm-10">{q.text}</div>
                </div>
                <div className="form-group">
                  {(() => {
                    return q.values.map((a, aIdx) => {
                      return (
                        <div key={"question_"+qIdx+"_answer_"+aIdx}>
                          <label className="control-label col-sm-2" htmlFor={"question_"+qIdx+"_answer_"+aIdx}>
                            {a.value}
                          </label>
                          <input type="radio" className="form-control"
                            name={"question_"+qIdx}
                            id={"question_"+qIdx+"_answer_"+aIdx} />
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            );
          });
        })()}
      </form>
    );
  }
});

export default ScenarioEvalView;
