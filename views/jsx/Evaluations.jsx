import $            from 'jquery';
import React        from 'react';
import LoadingMixin from './LoadingMixin.jsx';
import api          from '../../api_routes.js';

var Router = require('react-router');

var Evaluations = React.createClass({
  mixins: [LoadingMixin],
  getInitialState: function() {
    return {
      evaluations: 0,
      key: null
    };
  },
  componentDidMount: function() {

    var url = api.reverse('evaluations_count', {
      uuid : this.props.id
    });

    this.loading();
    console.log(url);
    $.ajax(url, {
      dataType: 'json',
      error: (xhr) => {
        this.loaded();
      },
      success : (res) => {
        console.log(res);
        this.loaded({evaluations:  res });
      }
    });

  },
  render: function() {
    if (this.state.loading) {
      return <span>Loading...</span>;
    }

    return (<span>{this.state.evaluations}</span>);
  }
});

export default Evaluations;
