import React from 'react';

var Router = require('react-router')
  , Link = Router.Link;

export default class ProfileFacebook extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <h3 className="text-primary"><span className="fa fa-facebook"></span> Facebook</h3>

      <!-- check if the user has this token (is the user authenticated with this social account) -->
      <% if (user.facebook.token) { %>
          <div>
              <strong>id</strong>: <%= user.facebook.id %><br/>
              <strong>token</strong>: <%= user.facebook.token %><br/>
              <strong>email</strong>: <%= user.facebook.email %><br/>
              <strong>name</strong>: <%= user.facebook.name %><br/>
              <strong>displayName</strong>: <%= user.facebook.displayName %><br/>
          </div>

          <a href="/users/<%=user.uuid %>/unlink/facebook" className="btn btn-primary top10">Unlink</a>
      <% } else if(req_user.uuid == user.uuid) { %>
          <a href="/auth/connect/facebook" className="btn btn-primary">Connect Facebook</a>
      <% } %>
    );
  }
}
