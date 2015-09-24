import React from 'react';

var QuestionnaireValuesEditView = React.createClass({
  getInitialState: function() {
    return {
      values : this.props.values
    }
  },
  updatedValueText: function(index) {
    return (evt) => {
      this.state.values[index].value = evt.target.value;
      this.props.handleChangedValues(this.state.values);
    }
  },
  updatedValueWeight: function(index) {
    return (evt) => {
      this.state.values[index].weight = parseInt(evt.target.value);
      this.props.handleChangedValues(this.state.values);
    }
  },
  onAddValue: function(evt) {
    this.state.values.push({ value : 'OPTION TEXT', weight : 0 });
    this.props.handleChangedValues(this.state.values);
  },
  onDelValue: function(evt) {
    this.state.values = this.state.values.slice(0, this.state.values.length - 1);
    this.props.handleChangedValues(this.state.values);
  },
  handleChangedValues: function(questionIndex) {
    return (values) => {
      this.state.values = values;
      this.props.handleChangedValues(this.state.values);
    }
  },
  render: function() {
    var self = this;
    var qIndex = this.props.question;
    return (
      <div>
        <div className="row pull-right">
          <button
            type="button"
            className="btn btn-default"
            onClick={this.onAddValue}>+</button>
          <button
            type="button"
            className="btn btn-default"
            onClick={this.onDelValue}
            disabled={this.state.values.length <= 1 ? 'disabled' : ''}>-</button>
        </div>
        {(() => {
          return this.state.values.map((value, index) => {
            return (
              <div key={"question_" + qIndex + "_value_" + index}>
                <div className="form-group">
                  <label className="control-label col-sm-2" htmlFor={"text_" + index}>Text</label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      className="form-control"
                      name={"text_" + index}
                      id={"text_" + index}
                      value={value.value}
                      onChange={this.updatedValueText(index)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="control-label col-sm-2" htmlFor={"weight_" + index}>Weight</label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      className="form-control"
                      name={"weight_" + index}
                      id={"weight_" + index}
                      value={value.weight}
                      onChange={this.updatedValueWeight(index)} />
                  </div>
                </div>
              </div>
            );
          });
        })()}
      </div>
    );
  }
});

export default QuestionnaireValuesEditView;
