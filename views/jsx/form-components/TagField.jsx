import React from 'react';

var TagField = React.createClass({
  getInitialState : function() {
    return {
      tags : this.props.tags ? this.props.tags : [],
      tagsString : this.props.tags ? this.props.tags.join(', ') : '',
      sectorsArray : ['transport', 'energy', 'retail', 'public', 'environment', 'agriculture', 'healthcare', 'cultural'],
      actorsArray : ['private', 'lawyer', 'researcher', 'designer', 'developer'],
      devicesArray : ['mobile', 'cloud', 'wearable sensors', 'smartphone', 'gas sensor', 'rfid'],
      suggestions : [],
      reset : null
    };
  },
  componentWillReceiveProps : function(props) {
    if(this.state.tagsString === '') {
      this.setState({
        tags : props.tags ? props.tags : [],
        tagsString : props.tags ? props.tags.join(', ') : ''
      });
    }
  },
  handleKey: function (evt) {
    if(evt.charCode ===  32) {
      this.state.tags.push(evt.target.value);
      this.props.onChange(this.state.tags);
      this.state.reset = '';
    }else {
      this.state.reset = null;
    }
  },
  getSuggestions: function () {
    return this.state.suggestions.map(function(suggest, i){
      return <div
        className="oc-tag-item"
        onClick={this.addTag.bind(this, i)}>
        <div className={'oc-tag-icon ' + suggest + '_icon'}>
        </div>
        <span className="oc-tag-item-text" >
          {suggest}
        </span>
      </div>;
    }, this);
  },
  addTag: function (i) {
    this.state.tags.push(this.state.suggestions[i]);
    this.props.onChange(this.state.tags);
    this.setState(this.state);
  },
  handleGym: function (value, inputArray) {
    var results = [];
    for (var i = 0; i < inputArray.length; i++) {
      if (inputArray[i].indexOf(value) === 0) {
        results.push(inputArray[i]);
      }
    }
    this.state.suggestions = results;
    this.setState(this.state);
  },
  handleSuggest: function (evt) {

    if (evt.target.value !== '' && this.props.id === 'scenarioListSearchFormActors') {
      this.handleGym(evt.target.value, this.state.actorsArray);
    }
    if (evt.target.value !== '' && this.props.id === 'scenarioListSearchFormSectors') {
      this.handleGym(evt.target.value, this.state.sectorsArray);
    }
    if (this.props.id === 'scenarioListSearchFormDevices') {
      this.handleGym(evt.target.value, this.state.devicesArray);
    }
  },
  handleClick: function (i) {
    this.state.tags.splice(i, 1);
    this.setState(this.state);
  },
  handleChange : function(evt) {
    if (this.isMounted()) {
      this.state.tagsString = evt.target.value;
      this.state.tags = this.state.tagsString.split(' ').map((s) => s.trim()).filter((s) => s.length > 0);
      this.setState(this.state);
      this.props.onChange(this.state.tags);

    }
  },
  render : function() {
    return (
      <div>
        <div>
          {this.state.tags.map(function(tag, i) {
            return (
              <div
                className="oc-tag-item"
                key={i}>
                <div className={"oc-tag-icon " + tag + "_icon"}>
                </div>
                <span className="oc-tag-item-text">
                  {tag}
                </span>
                <i
                  onClick={this.handleClick.bind(this, i)}
                  className="fa fa-times oc-tag-close"
                  >
                </i>
              </div>
            );
          }, this)}
        </div>
        <input
          type="text"
          className="oc-input-extra"
          placeholder={this.props.placeholder ? this.props.placeholder : ''}
          onKeyPress={this.handleKey}
          value={this.state.reset}
          onChange={this.handleSuggest}
          />
        <div className="oc-tag-suggestions-wrapper">
          <span>
            {
              this.getSuggestions()
            }
          </span>
        </div>
        <input
          type="text"
          id={this.props.id ? this.props.id : ''}
          className="oc-input"
          value={this.state.tagsString}
          placeholder={this.props.placeholder ? this.props.placeholder : ''}
          disabled={this.props.loading || this.props.disabled ? 'disabled' : ''}
          onChange={this.handleChange} />
      </div>
    );
  }
});

export default TagField;
