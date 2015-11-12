import $            from 'jquery';
import React        from 'react';
import LoadingMixin from './LoadingMixin.jsx';
import api          from '../../api_routes.js';

var Router = require('react-router');

var Score = React.createClass({
  mixins: [LoadingMixin],
  getInitialState: function() {
    return {
      score: 0,
      key: null
    };
  },
  componentDidMount: function() {

    if (!this.props.scope || !this.props.id) {
      return;
    }

    var url = api.reverse('evaluation_score', {
      uuid : this.props.id
    });

    this.loading();
    //console.log(url);
    $.ajax(url, {
      dataType: 'json',
      error: (xhr) => {
        this.loaded();
      },
      success : (res) => {
        //console.log(res);
        var sc=((parseFloat(res.tech) + parseFloat(res.noTech))/2).toFixed(1);
        this.loaded({score: sc});
      }
    });

  },
  render: function() {
    if (this.state.loading) {
      return <span>Loading...</span>;
    }

    return (<span>{this.state.score}</span>);
  }
});

export default Score;
