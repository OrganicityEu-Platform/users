import React from 'react';
import $     from 'jquery';

var TagField = React.createClass({
  getInitialState : function() {
    return {
      tags            : this.props.tags ? this.props.tags : [],
      tagsString      : this.props.tags ? this.props.tags.join(', ') : '',
      data            : this.props.data ? this.props.data : [],
      suggestions     : [],
      reset           : null,
      inputLabel      : '',
      doEdit          : this.props.doEdit ? this.props.doEdit : false
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
    if(evt.charCode ===  32 || evt.charCode === 44 || evt.charCode === 13) {
      this.state.inputLabel = '';
      if (evt.target.value !== ' ' && evt.target.value !== ',')  {
        var e;
        var check = true;
        for(e = 0; e < this.state.tags.length; e++) {
          if (this.state.tags[e].toLowerCase() === evt.target.value.trim().toLowerCase()) {
            check = false;
          }
        }
        if (check) {
          this.state.tags.push(evt.target.value);
          this.props.onChange(this.state.tags);
          this.state.suggestions = [];
        }
      }
      evt.target.value = '';
    }
  },
  getSuggestions: function () {
    return this.state.suggestions.map(function(suggest, i){
      return <div
        className="oc-tag-item"
        id={this.props.id ? this.props.id + '_suggest_tag_item' : ''}
        onClick={this.addTag.bind(this, i)}>
        <div
          className={'oc-tag-icon ' + suggest + '_icon'}
          id={this.props.id ? this.props.id + '_tag' : ''}>
        </div>
        <span className="oc-tag-item-text" >
          {suggest}
        </span>
      </div>;
    }, this);
  },
  addTag: function (i) {
    this.state.tags.push(this.state.suggestions[i]);
    this.state.suggestions.splice(i, 1);
    this.props.onChange(this.state.tags);
    this.setState(this.state);
    $('#' + this.props.id).val('');
    this.state.inputLabel = '';
  },
  handleGym: function (value, inputArray) {
    var results = [];
    for (var i = 0; i < inputArray.length; i++) {
      if (inputArray[i].indexOf(value) === 0) {
        results.push(inputArray[i]);
      }
    }
    var y;
    var e;
    for (y = 0; y < this.state.tags.length; y++) {
      for(e = 0; e < results.length; e++) {
        if(this.state.tags[y] == results[e]) {
          results.splice(e, 1);
        }
      }
    }
    this.state.suggestions = results;
    this.setState(this.state);
  },
  handleSuggest: function (evt) {
    if (evt.charCode === 32 || evt.charCode === 44 || evt.charCode === 13) {
      evt.preventDefault();
    }
    if (evt.target.value !== '') {
      this.handleGym(evt.target.value, this.state.data);
      this.state.inputLabel = this.props.placeholder;
      this.handleKey(evt);
    }else{
      this.state.inputLabel = '';
      this.setState(this.state);
    }
  },
  handleClick: function (i) {
    this.state.tags.splice(i, 1);
    this.setState(this.state);
    this.props.onChange(this.state.tags);
  },
  handleChange : function(evt) {
    if (this.isMounted()) {
      this.state.tagsString = evt.target.value;
      this.state.tags = this.state.tagsString.split(' ').map((s) => s.trim()).filter((s) => s.length > 0);
      this.setState(this.state);
      this.props.onChange(this.state.tags);
    }
  },
  clearTags : function () {
    this.state.tags = [];
    this.setState(this.state);
    this.props.onChange(this.state.tags);
  },
  getLabel : function () {
    if (this.state.suggestions.length > 0) {
      return <span className="oc-sug">suggestions</span>;
    }
  },
  render : function() {
    return (
      <div id={this.props.id + '_wrapper'}>
        <div className="oc-tags-wrapper">
          {this.state.tags.map(function(tag, i) {
            return (
              <div
                className="oc-tag-item"
                id={this.props.id ? this.props.id + '_tag_item' : ''}
                key={i}>
                <div className={"oc-tag-icon " + tag + "_icon"}
                  id={this.props.id ? this.props.id + '_tag' : ''}>
                </div>
                <span className="oc-tag-item-text">
                  {tag}
                </span>
                {this.state.doEdit ?
                  <i
                    onClick={this.handleClick.bind(this, i)}
                    className="fa fa-times oc-tag-close"
                    >
                  </i>:
                  null
                }

              </div>
            );
          }, this)}
        </div>
        <div>
          <span className="oc-tag-field-label">{this.state.inputLabel}</span>
          {this.state.doEdit ?
            <span
              onClick={this.clearTags}
              className="oc-tag-field-clear-tags">
              <i className="fa fa-times oc-tag-clear"></i>
              {this.props.clearText ? this.props.clearText : 'clear all tags'}
            </span> : null}

          <input
            type="text"
            className="oc-input-extra oc-tag-input"
            placeholder={this.props.placeholder ? this.props.placeholder : ''}
            onKeyPress={this.handleSuggest}
            value={this.state.reset}
            id={this.props.id}
            autoComplete="off"
            onChange={this.handleSuggest}
            />
        </div>
        <div className="oc-tag-suggestions-wrapper">
          {this.getLabel()}
          <span>
            {
              this.getSuggestions()
            }
          </span>
        </div>
        <input
          type="text"
          id={this.props.id ? this.props.id : ''}
          className="oc-input oc-tag-string-input"
          value={this.state.tagsString}
          placeholder={this.props.placeholder ? this.props.placeholder : ''}
          disabled={this.props.loading || this.props.disabled ? 'disabled' : ''}
          onChange={this.handleChange} />
      </div>
    );
  }
});

export default TagField;
