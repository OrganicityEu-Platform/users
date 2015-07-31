import $ from 'jquery';
import React from 'react';
import ReactMixin from 'react-mixin';
import UserHasRoleMixin from '../UserHasRoleMixin.jsx';

var Router = require('react-router')
  , Link = Router.Link;

export default class Profile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
    $.ajax('/auth/currentUser', {
      dataType: 'json',
      error: (jqXHR, textStatus, errorThrown) => {
        console.log(jqXHR, textStatus, errorThrown);
      },
      success: (data) => {
        console.log(data);
        this.setState(data);
      },
    });
  }

  handleSaveProfile() {
    var o = {
      name   : $('#profile-name').val(),
      gender : $('input[name=gender]:checked').val()
    }
    if (this.userHasRole("admin")) {
      o.roles = $('#profile-roles').val().trim().split(",");
    }

    $.ajax({
        type : "PATCH",
        url : "/users/" + this.state.uuid,
        data : JSON.stringify(o),
        contentType : 'application/json',
        success : function(o){
          alert("Success");
        },
        error: function(e){
          console.log("error", e);
        }
    });
  }

  render() {
    return (
      <div className="row">
        <div className="col-sm-12">
          <div className="well">
            <div className="form-group">
  					  <label htmlFor="profile-name">Name</label>
              <input type="text" className="form-control" id="profile-name" placeholder="Name..." value={(this.state.name || '')} />
    				</div>
            <div className="form-group">
              <div className="col-sm-12">
                <label htmlFor="scenario-gender">Gender</label>
    					</div>
    					<div className="col-sm-12">
    						<input type="radio" name="gender" id="profile-gender-f" value="f" /> Female<br/>
    						<input type="radio" name="gender" id="profile-gender-m" value="m" /> Male
    					</div>
    				</div>
            {(() => {
              if (this.userHasRole("admin")) {
                return (
                  <div className="form-group">
        						<label htmlFor="profile-roles">Roles</label>
        						<input type="text" className="form-control" id="profile-roles" placeholder="Roles..." value={this.state.roles ? this.state.roles.join(",") : ''} />
        					</div>
                );
              } else {
                return null;
              }
            })()}
            <button id="profile-send" type="submit" className="btn btn-default" onClick={this.handleSaveProfile}>Save Profile</button>
  		    </div>
        </div>
  		</div>
    );
  }
}

ReactMixin(Profile.prototype, UserHasRoleMixin);
