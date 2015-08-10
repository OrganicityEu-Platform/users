import $          from 'jquery';
import React      from 'react';
import FlashQueue from '../FlashQueue.jsx';
import api        from '../../../api_routes.js';

var Router = require('react-router');
var Link = Router.Link;

var UserAvatar = React.createClass({
  mixins: [FlashQueue.Mixin],
  getInitialState: function() {
    return null;
  },
  componentDidMount: function() {
    var url = api.reverse('user_info', { uuid : this.props.uuid });
    $.ajax(url, {
      dataType : 'json',
      error : this.flashOnAjaxError(url, 'Error loading user info'),
      success : (user) => {
        this.setState(user);
      }
    });
  },
  render: function() {
    var text;
    if (!this.state) {
      text = 'Loading...';
    } else if (this.state.error) {
      text = 'Error :(';
    } else {
      text = this.state.name;
    }
    return (
      <div>{text}</div>
    );
  }
});

export default UserAvatar;
