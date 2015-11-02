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
        this.state.user = {
          name : 'Unknown or deleted user'
        };
        this.setState(this.state);
        this.loaded();
      },
      success : (user) => {
        this.state.user = user;
        this.setState(this.state);
        this.loaded();
      }
    });
  },
  render: function() {
    if (this.state.loading) {
      return <div>Loading...</div>;
    }

    var userText = this.props.uuid;
    if (this.state.user.name && this.state.user.name !== '') {
      userText = this.state.user.name;
    }
    return <Link to="userView" params={{ uuid: this.props.uuid }}>{userText}</Link>;
  }
});

export default UserAvatar;
