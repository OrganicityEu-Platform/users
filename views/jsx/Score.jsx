import $            from 'jquery';
import React        from 'react';
import LoadingMixin from './LoadingMixin.jsx';
import api          from '../../api_routes.js';
import Loading      from './Loading.jsx';

var Router = require('react-router');

var Score = React.createClass({
  getInitialState: function() {
    return {};
  },
  componentDidMount: function() {
  },
  render: function() {
    var score = this.props.score;
    if (score && score.numOfEvaluations) {
      var s = ((parseFloat(score.tech) + parseFloat(score.noTech)) / 2).toFixed(1);
      return (<span>{s}</span>);
    }
    return (<span>0</span>);
  }
});

export default Score;
