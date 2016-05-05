import React  from 'react';
import Router from 'react-router';
import I18nMixin from '../i18n/I18nMixin.jsx';

var UserEditButton = React.createClass({
  mixins: [Router.Navigation, I18nMixin],

  handleClick: function() {
    this.transitionTo('admin_userEdit', { uuid: this.props.user.uuid });
    if (typeof this.props.onChange == 'function') {
      this.props.onChange();
    }
  },
  render: function() {
    return (
      <button className="oc-button all-uppercase" onClick={this.handleClick}>{this.i18n('Admin.edit', 'EDIT')}</button>
    );
    return null;
  }
});

export default UserEditButton;
