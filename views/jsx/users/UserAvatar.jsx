import $            from 'jquery';
import React        from 'react';
import FlashQueue   from '../FlashQueue.jsx';
import LoadingMixin from '../LoadingMixin.jsx';
import api          from '../../../api_routes.js';

var Router = require('react-router');
var Link = Router.Link;

var UserAvatar = React.createClass({
  mixins: [FlashQueue.Mixin, LoadingMixin],
  getInitialState: function() {
    return {
      loading: true,
      user: null
    };
  },
  componentDidMount: function() {
    this.loading();
    var url = api.reverse('user_info', { uuid : this.props.uuid });
    $.ajax(url, {
      dataType : 'json',
      error : (jqXHR, textStatus, errorThrown) => {
        this.loaded();
        this.flashOnAjaxError(url, 'Error loading user info')(jqXHR, textStatus, errorThrown);
      },
      success : (user) => {
        this.state.loading = false;
        this.state.user = user;
        this.setState(this.state);
      }
    });
  },
  render: function() {
    if (this.state.loading) {
      return <div>Loading...</div>;
    }
    return <div>{this.state.user.name}</div>;
  }
});

export default UserAvatar;
