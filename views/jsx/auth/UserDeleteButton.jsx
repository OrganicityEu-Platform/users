import $            from 'jquery';
import React        from 'react';
import api          from '../../../api_routes.js';
import LoadingMixin from '../LoadingMixin.jsx';

var UserDeleteButton = React.createClass({
  mixins: [LoadingMixin],
  handleClick: function() {
    var sure = window.confirm(
      'Are you sure you want to delete the account of ' + this.props.user.name +
      ' (UUID: ' + this.props.user.uuid + ')?'
    );
    if (sure) {
      this.loading();
      var url = api.reverse('user_by_uuid', { uuid : this.props.user.uuid });
      $.ajax(url, {
        method: 'DELETE',
        error: this.loadingError(url, 'Error deleting user'),
        success: () => {
          this.loaded();
          if (typeof this.props.onDelete == 'function') {
            this.props.onDelete(this.props.user);
          }
        }
      });
    }
  },
  render: function() {
    return (
      <button className="userDeleteButton"
        disabled={this.isLoading() ? 'disabled' : ''}
        onClick={this.handleClick}>DELETE</button>
    );
  }
});

export default UserDeleteButton;
