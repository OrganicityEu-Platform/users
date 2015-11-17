import React  from 'react';
import Router from 'react-router';

var ScenarioCheck = React.createClass({
  render: function() {

    if (this.props.isvalid) {
      return (
        <i className="scenario-article-check-icon fa fa-check"></i>
      );
    } else {
      return (
        <i className="scenario-article-check-icon fa fa-exclamation-circle"></i>
      );
    }

  }
});

export default ScenarioCheck;
