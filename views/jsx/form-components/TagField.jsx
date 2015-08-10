import React from 'react';

var TagField = React.createClass({
  getInitialState : function() {
    return {
      tags : this.props.tags ? this.props.tags : [],
      tagsString : this.props.tags ? this.props.tags.join(', ') : ''
    };
  },
  handleChange : function(evt) {
    this.state.tagsString = evt.target.value;
    this.state.tags = this.state.tagsString.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
    this.setState(this.state);
    this.props.onChange(this.state.tags);
  },
  render : function() {
    return (
      <input type="text" className="form-control" name="sectors" id="sectors" value={this.state.tagsString}
        onChange={this.handleChange} />
    );
  }
});

export default TagField;
