import React from 'react';

var Router = require('react-router')
  , Link = Router.Link;

export default class ProfileLocalLogin extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="col-sm-6">
        <div className="well" style="overflow:hidden;white-space:nowrap;text-overflow:ellipsis; ">
          <h3><span className="fa fa-user"></span> Local</h3>


              <% if (user.local.email) { %>
                  <div>
                      <strong>id</strong>: <%= user._id %><br/>
                      <strong>email</strong>: <%= user.local.email %><br/>
                      <strong>password</strong>: <%= user.local.password %>
                  </div>
                  <a href="/api/v1/users/<%=user.uuid %>/unlink/local" className="btn btn-default top10">Unlink</a>
        <div className="form-group">
          <label htmlFor="profile-password">New Password</label>
          <input type="password" className="form-control" id="profile-password-new1" placeholder="New Password" value="">
          <input type="password" className="form-control top5" id="profile-password-new2" placeholder="Repeat new Password" value="">
          <button id="password-send" type="submit" className="btn btn-default top5">Change Password</button>
        </div>
              <% } else if(req_user.uuid == user.uuid) { %>
                  <a href="/api/v1/auth/connect/local" className="btn btn-default">Connect Local</a>
              <% } %>

      <script>
      var handle = function() {
        if($('#profile-password-new1').val() != $('#profile-password-new2').val()) {
          alert("New Passwords are not the same");
          return;
        }

            var o = {
          local : {
            password : $('#profile-password-new1').val()
          }
            }
            $.ajax({
                type : "PATCH",
                url : "/api/v1/users/<%=user.uuid %>",
                data : JSON.stringify(o),
                contentType : 'application/json',
                success : function(o){
            alert("Password change successful.");
                },
                error: function(e){
                    console.log("error", e);
                }
            });
        };
        $('#password-send').click(handle);
      </script>

          </div>
      </div>
    );
  }
}
