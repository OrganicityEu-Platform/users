import $                 from 'jquery';
import React             from 'react';
import Profile           from './Profile.jsx';

var Router = require('react-router');
var Link = Router.Link;

var UserEditView = React.createClass({
  getInitialState: function() {
    return null;
  },
  render: function() {
    return (
      <div>
        <Profile uuid={this.props.params.uuid}/>
      </div>
    );
  }
});

export default UserEditView;
