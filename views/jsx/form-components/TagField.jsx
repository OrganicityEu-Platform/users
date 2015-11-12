import React from 'react';

var TagField = React.createClass({
  getInitialState : function() {
    return {
      tags : this.props.tags ? this.props.tags : [],
      tagsString : this.props.tags ? this.props.tags.join(', ') : ''
    }
  },
  componentWillReceiveProps : function(props) {
    if(this.state.tagsString === '') {
      this.setState({
        tags : props.tags ? props.tags : [],
        tagsString : props.tags ? props.tags.join(', ') : ''
      });
    }
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
      <div>
        <input type="text"
          id={this.props.id ? this.props.id : ''}
          className="form-control"
          value={this.state.tagsString}
          placeholder={this.props.placeholder ? this.props.placeholder : ''}
          disabled={this.props.loading || this.props.disabled ? 'disabled' : ''}
          onChange={this.handleChange} />
      </div>
    );
  }
});

export default TagField;
