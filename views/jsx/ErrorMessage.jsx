import React from 'react';

/*
 * Prints an array of Messages as errors
 *
 * <ErrorMessage messages={[]} />
 */
var ErrorMessage = React.createClass({
  render: function() {

    if (!this.props.messages || this.props.messages.length === 0) {
      return null;
    }

    if(typeof this.props.messages === 'string') {
      return (
         <div>{this.renderHelpText(this.props.messages)}</div>
      )
    }

    return (
      <div>{this.props.messages.map(this.renderHelpText)}</div>
    );
  },
  renderHelpText: function(message) {
    var divStyle = {
      marginBottom : 0
    };
    return (
      <div className="alert alert-danger" style={divStyle}>{message}</div>
    );
  }
});

export default ErrorMessage;
