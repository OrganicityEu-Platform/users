import React from 'react';

var Router = require('react-router')
  , Link = Router.Link;

export default class ProfileTwitter extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <h3 className="text-info"><span className="fa fa-twitter"></span> Twitter</h3>

      <% if (user.twitter.token) { %>
          <div>
              <strong>id</strong>: <%= user.twitter.id %><br/>
              <strong>token</strong>: <%= user.twitter.token %><br/>
              <strong>display name</strong>: <%= user.twitter.displayName %><br/>
              <strong>username</strong>: <%= user.twitter.username %>
          </div>
          <a href="/users/<%=user.uuid %>/unlink/twitter" className="btn btn-info top10">Unlink</a>
      <% } else if(req_user.uuid == user.uuid) { %>
          <a href="/auth/connect/twitter" className="btn btn-info">Connect Twitter</a>
      <% } %>
    );
  }
}
