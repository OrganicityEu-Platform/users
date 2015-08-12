import $          from 'jquery';
import React      from 'react';
import api        from '../../../api_routes.js';
import FlashQueue from '../FlashQueue.jsx';

var UserDeleteButton = React.createClass({
  mixins: [FlashQueue.Mixin],
  handleClick: function() {
    var sure = window.confirm(
      'Are you sure you want to delete the account of ' + this.props.user.name +
      ' (UUID: ' + this.props.user.uuid + ')?'
    );
    if (sure) {
      var url = api.reverse('user_by_uuid', { uuid : this.props.user.uuid });
      $.ajax(url, {
        method: 'DELETE',
        error: this.flashOnAjaxError(url, 'Error deleting user'),
        success: () => {
          if (typeof this.props.onDelete == 'function') {
            this.props.onDelete(this.props.user);
          }
        }
      });
    }
  },
  render: function() {
    return (
      <button className="userDeleteButton" onClick={this.handleClick}>DELETE</button>
    );
  }
});

export default UserDeleteButton;
