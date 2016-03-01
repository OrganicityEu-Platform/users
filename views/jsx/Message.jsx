import React from 'react';

/*
 * Prints messages.
 *
 * Args:
 * - message:  Prints a single message
 * - messages: prints an array of messages
 * - type: ['success', 'info', 'warning', 'danger']
 *
 * <Message message="..." />
 * <essage messages={[]} />
 */
var Message = React.createClass({
  getInitialState() {
    return {
      type: 'danger'
    };
  },
  componentDidMount() {
    var allowedTypes = ['success', 'info', 'warning', 'danger'];
    if (allowedTypes.some((t) => t === this.props.type)) {
      this.setState({
        type: this.props.type
      });
    }
  },
  render: function() {

    if (!this.props.message && !this.props.messages) {
      return null;
    }

    if (this.props.message) {
      return (
         <div>{this.renderDiv(this.props.message)}</div>
      );
    }

    if (this.props.messages) {
      return (
        <div>{this.props.messages.map(this.renderDiv)}</div>
      );
    }

    return null;

  },
  renderDiv: function(message) {
    var classes = ['oc-msg alert', 'alert-' + this.state.type];
    return (
      <div className={classes.join(' ')}>{message}</div>
    );
  }
});

export default Message;
