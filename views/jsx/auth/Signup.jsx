import $          from 'jquery';
import React      from 'react';
import FlashQueue from '../FlashQueue.jsx';
import api        from '../../../api_routes.js';
import ui         from '../../../ui_routes.js';

var Router = require('react-router');
var Link = Router.Link;
var Navigation = Router.Navigation;

var Signup = React.createClass({
  mixins: [Navigation, FlashQueue.Mixin],
  getInitialState : function() {
    return {
      email : '',
      password : '',
      password_repeat : '',
      error : null
    };
  },
  isValid : function() {
    // TODO improve validation
    return (
      this.state.email != '' &&
      this.state.email !== undefined &&
      this.state.password !== undefined &&
      this.state.password != '' &&
      this.state.password == this.state.password_repeat
    );
  },
  handleChangedEmail : function(evt) {
    this.state.email = evt.target.value;
    this.setState(this.state);
  },
  handleChangedPassword : function(evt) {
    this.state.password = evt.target.value;
    this.setState(this.state);
  },
  handleChangedPasswordRepeat : function(evt) {
    this.state.password_repeat = evt.target.value;
    this.setState(this.state);
  },
  handleSubmit : function(evt) {
    evt.preventDefault();
    var self = this;
    $.ajax(api.reverse('signup'), {
      error: (jqXHR, textStatus, errorThrown) => {
        if (jqXHR.status == 500) {
          self.flashOnAjaxError(jqXHR, textStatus, errorThrown);
        } else {
          self.state.error = 'Error signing up: ' + textStatus;
          self.setState(this.state);
        }
      },
      success: (currentUser) => {
        self.props.onLogin(currentUser);
        self.transitionTo(ui.route('profile'));
      },
      method: 'POST',
      data: {
        email: self.state.email,
        password: self.state.password
      }
    });
  },
  render : function() {
    return (
      <div className="col-sm-6 col-sm-offset-3">
        <h1><span className="fa fa-sign-in"></span> Signup</h1>
        {(() => {
          if (this.state.error) {
            return (<div className="alert alert-warning">{this.state.error}</div>);
          }
        })()}
        <form action={api.reverse('signup')} method="post">
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="text" className="form-control" name="email" value={this.state.email}
                  onChange={this.handleChangedEmail} />
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" className="form-control" name="password" value={this.state.password}
                  onChange={this.handleChangedPassword} />
            </div>
            <div className="form-group">
                <label htmlFor="password_repeat">Repeat Password</label>
                <input type="password" className="form-control" name="password_repeat"
                  value={this.state.password_repeat} onChange={this.handleChangedPasswordRepeat} />
            </div>
            <button type="submit"
                    className="btn btn-warning btn-lg"
                    disabled={this.isValid() ? '' : 'disabled'}
                    onClick={this.handleSubmit}>Signup</button>
        </form>
        <hr/>
        <p>Already have an account? <Link to="local-login">Login</Link></p>
      </div>
    );
  }
});

export default Signup;
