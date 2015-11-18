import React from 'react';

var Loading = React.createClass({
  render: function() {
    var s = {
      textAlign: 'center'
    };

    var classNames = 'fa fa-spinner fa-spin';
    if (this.props.size) {
      classNames += ' fa-' + this.props.size + 'x';
    }

    return (<div style={s}><i className={classNames}></i><br/>{this.props.message}</div>);
  }
});

export default Loading;
