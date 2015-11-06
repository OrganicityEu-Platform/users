import React from 'react';

/*
 * Prints an array of Messages as errors
 *
 * <ErrorMessage messages={[]} />
 */
var ErrorMessage = React.createClass({
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

      // Workaround:
      // FIXME: https://github.com/jurassix/react-validation-mixin/issues/56
      if (typeof(this.props.messages) === 'string') {
        return (
           <div>{this.renderDiv(this.props.messages)}</div>
        );
      }

      return (
        <div>{this.props.messages.map(this.renderDiv)}</div>
      );
    }

    return null;

  },
  renderDiv: function(message) {

    console.log('Render Message', message);

    var classes = ['alert', 'alert-' + this.state.type];
    return (
      <div className={classes.join(' ')}>{message}</div>
    );
  }
});

export default ErrorMessage;
