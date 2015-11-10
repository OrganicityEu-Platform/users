import $            from 'jquery';
import React        from 'react';
import LoadingMixin from './LoadingMixin.jsx';
import api          from '../../api_routes.js';

var Router = require('react-router');

var Counter = React.createClass({
  mixins: [LoadingMixin],
  getInitialState: function() {
    return {
      counter: 0,
      key: null
    };
  },
  componentDidMount: function() {

    if (!this.props.scope || !this.props.id) {
      return;
    }

    var url = api.reverse('counter', {
      scope : this.props.scope,
      id : this.props.id
    });

    this.loading();
    $.ajax(url, {
      dataType: 'json',
      error: (xhr) => {
        this.loaded();
      },
      success : (res) => {
        this.loaded({counter: res.counter});
      }
    });

  },
  render: function() {
    if (this.state.loading) {
      return <span>Loading...</span>;
    }

    return (<span>{this.state.counter}</span>);
  }
});

export default Counter;
