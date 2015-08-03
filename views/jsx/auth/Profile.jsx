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
    this.propTypes = {
      name : React.PropTypes.string,
      gender : React.PropTypes.oneOf(['m', 'f'])
    };

    this.handleChangedName.bind(this);
    this.handleChangedGender.bind(this);
    this.handleChangedRoles.bind(this);
    this.handleSubmit.bind(this);

    $.ajax('/auth/currentUser', {
      dataType: 'json',
      error: (jqXHR, textStatus, errorThrown) => {
        console.log(jqXHR, textStatus, errorThrown);
      },
      success: (data) => {
        this.setState(data);
      },
    });
  }

  handleChangedName(evt) {
    var newState = this.state;
    newState.name = evt.target.value;
    this.setState(newState);
  }

  handleChangedGender(evt) {
    var newState = this.state;
    newState.gender = evt.target.value;
    this.setState(newState);
  }

  handleChangedRoles(evt) {
    var newState = this.state;
    newState.roles = evt.target.value.trim().split(",");
    this.setState(newState);
  }

  handleSubmit() {
    $.ajax({
        type : "PATCH",
        url : "/users/" + this.state.uuid,
        data : JSON.stringify(this.state),
        contentType : 'application/json',
        success : function(o){
          alert("Success");
        },
        error : function(e) {
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
              <input type="text" className="form-control" id="profile-name" placeholder="Firstname Lastname" value={this.state.name} onChange={this.handleChangedName} />
    				</div>
            <div className="form-group">
              <div className="col-sm-12">
                <label htmlFor="scenario-gender">Gender</label>
    					</div>
    					<div className="col-sm-12">
    						<input type="radio" name="gender" id="profile-gender-f" value="f" onChange={this.handleChangedGender} /> Female<br/>
    						<input type="radio" name="gender" id="profile-gender-m" value="m" onChange={this.handleChangedGender} /> Male
    					</div>
    				</div>
            {(() => {
              if (this.userHasRole("admin")) {
                return (
                  <div className="form-group">
        						<label htmlFor="profile-roles">Roles</label>
        						<input type="text" className="form-control" id="profile-roles" placeholder="Roles..." value={this.state.roles ? this.state.roles.join(",") : ''} onChange={this.handleChangedRoles} />
        					</div>
                );
              } else {
                return null;
              }
            })()}
            <button id="profile-send" type="submit" className="btn btn-default" onClick={this.handleSubmit}>Save Profile</button>
  		    </div>
        </div>
  		</div>
    );
  }
}

ReactMixin(Profile.prototype, UserHasRoleMixin);
