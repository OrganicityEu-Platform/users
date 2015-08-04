import React from 'react';

var Router = require('react-router')
  , Link = Router.Link;

export default class ProfileGoogle extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <h3 className="text-danger"><span className="fa fa-google-plus"></span> Google+</h3>

      <% if (user.google.token) { %>
          <div>
              <strong>id</strong>: <%= user.google.id %><br/>
              <strong>token</strong>: <%= user.google.token %><br/>
              <strong>email</strong>: <%= user.google.email %><br/>
              <strong>name</strong>: <%= user.google.name %>
          </div>
          <a href="/api/v1/users/<%=user.uuid %>/unlink/google" className="btn btn-danger top10">Unlink</a>
      <% } else if(req_user.uuid == user.uuid) { %>
          <a href="/api/v1/auth/connect/google" className="btn btn-danger">Connect Google</a>
      <% } %>
    );
  }
}
