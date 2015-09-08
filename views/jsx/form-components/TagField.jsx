import React from 'react';

var TagField = React.createClass({
  getInitialState : function() {
    return {
      tags : this.props.tags ? this.props.tags : [],
      tagsString : this.props.tags ? this.props.tags.join(', ') : ''
    };
  },
  handleChange : function(evt) {
    if (this.isMounted()) {
      this.state.tagsString = evt.target.value;
      this.state.tags = this.state.tagsString.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
      this.setState(this.state);
      this.props.onChange(this.state.tags);
    }
  },
  render : function() {
    return (
      <input type="text"
        id={this.props.id ? this.props.id : ''}
        className="form-control"
        value={this.state.tagsString}
        placeholder={this.props.placeholder ? this.props.placeholder : ''}
        disabled={this.props.loading ? 'disabled' : ''}
        onChange={this.handleChange} />
    );
  }
});

export default TagField;
