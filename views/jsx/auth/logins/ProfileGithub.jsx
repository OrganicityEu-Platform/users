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
      <h3 className="text-info"><span className="fa fa-github"></span> Github</h3>

      <% if (user.github.token) { %>
          <div>
              <strong>id</strong>: <%= user.github.id %><br/>
              <strong>token</strong>: <%= user.github.token %><br/>
              <strong>username</strong>: <%= user.github.username %><br/>
              <strong>displayName</strong>: <%= user.github.displayName %>
          </div>

          <a href="/api/v1/users/<%=user.uuid %>/unlink/github" className="btn btn-info top10">Unlink</a>
      <% } else if(req_user.uuid == user.uuid) { %>
          <a href="/api/v1/auth/connect/github" className="btn btn-info">Connect Github</a>
      <% } %>
    );
  }
}
