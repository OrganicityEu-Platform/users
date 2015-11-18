import React from 'react';

var Loading = React.createClass({
  render: function() {
    var s = {
      textAlign: 'center'
    };
    return (<div style={s}><i className="fa fa-spinner fa-spin fa-2x"></i><br/>{this.props.message}</div>);
  }
});

export default Loading;
