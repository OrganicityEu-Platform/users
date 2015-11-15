import React  from 'react';
import Router from 'react-router';

var UserEditButton = React.createClass({
  mixins: [Router.Navigation],
  handleClick: function() {
    this.transitionTo('admin_userEdit', { uuid: this.props.user.uuid });
    if (typeof this.props.onChange == 'function') {
      this.props.onChange();
    }
  },
  render: function() {
    return (
      <button className="oc-button" onClick={this.handleClick}>EDIT</button>
    );
    return null;
  }
});

export default UserEditButton;
