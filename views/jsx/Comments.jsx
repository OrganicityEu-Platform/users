import $            from 'jquery';
import React        from 'react';
import LoadingMixin from './LoadingMixin.jsx';
import api          from '../../api_routes.js';

var Router = require('react-router');

var Comments = React.createClass({
  mixins: [LoadingMixin],
  getInitialState: function() {
    return {
      comments: 0,
      key: null
    };
  },
  componentDidMount: function() {

    var url = api.reverse('discus_statistics', {
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
        this.loaded({comments:  res.comments });
      }
    });

  },
  render: function() {
    if (this.state.loading) {
      return <span>Loading...</span>;
    }

    return (<span>{this.state.comments }</span>);
  }
});

export default Comments;
