import $            from 'jquery';
import React        from 'react';

import FlashQueue   from '../FlashQueue.jsx';
import LoadingMixin from '../LoadingMixin.jsx';

import api          from '../../../api_routes.js';

import validation   from 'react-validation-mixin';
import strategy     from 'joi-validation-strategy';
import UserJoi      from '../../../models/joi/user.js';

import Message      from '../Message.jsx';

var Router = require('react-router');

var ForgotPassword = React.createClass({
  mixins: [LoadingMixin],
  getInitialState : function() {
    return {
      initialized: false
    };
  },
  componentDidMount : function() {
    if (this.props.query.id) {
      this.setState({id : this.props.query.id});

      this.getValidatorData = function() {
        return {
          id: this.state.id,
          password: this.state.password,
          password_repeat : this.state.password_repeat
        };
      };
      this.validatorTypes = UserJoi.updatePassword;
    } else {
      this.getValidatorData = function() {
        return {
          email: this.state.email
        };
      };
      this.validatorTypes = UserJoi.forgotPassword;
    }
  },
  handleChangedEmail : function(evt) {
    this.state.email = evt.target.value;
    this.state.initialized = true;
    this.setState(this.state);
    this.props.validate();
  },
  handleChangedPassword : function(evt) {
    this.state.password = evt.target.value;
    this.state.initialized = true;
    this.setState(this.state);
    this.props.validate();
  },
  handleChangedPasswordRepeat : function(evt) {
    this.state.password_repeat = evt.target.value;
    this.state.initialized = true;
    this.setState(this.state);
    this.props.validate();
  },
  handleGoBack : function(evt) {
    console.log('Go back');
    this.setState({send: false});
  },
  handleSubmit : function(evt) {
    evt.preventDefault();
    if (this.props.isValid()) {
      this.loading();
      var url = api.reverse('forgot-password');
      $.ajax(url, {
        error: (xhr, textStatus, errorThrown) => {
          this.loaded();
          this.setState({send: false});
        },
        success: (currentUser) => {
          this.loaded();
          this.setState({send: true});
        },
        method: 'POST',
        data: {
          email: this.state.email
        }
      });
    }
  },
  handleSubmitPassword : function(evt) {
    evt.preventDefault();
    if (this.props.isValid()) {
      this.loading();
      var url = api.reverse('update-password');
      $.ajax(url, {
        error: (xhr, textStatus, errorThrown) => {
          this.loaded();
          this.setState({send: false});
          if(xhr.responseJSON.error) {
            this.setState({error: xhr.responseJSON.error});
          }
        },
        success: (currentUser) => {
          this.loaded();
          this.setState({send: true});
        },
        method: 'POST',
        data: {
          id: this.state.id,
          password: this.state.password
        }
      });
    }
  },
  render() {
    if (this.state.id) {

      if (this.state.send) {
        return (<Message type="danger" message="Password update successful sent!" type="success"/>);
      }

      if (this.state.error) {
        return (<Message type="danger" message={this.state.error}/>);
      }

      return (
        <div className="row">
          <div className="col-sm-6">
              <div className="form-group">
                <input type="password"
                  className="form-control oc-signup-password"
                  placeholder="password"
                  value={this.state.password}
                  disabled={this.isLoading() ? 'disabled' : ''}
                  onChange={this.handleChangedPassword} />
                <Message type="danger" messages={this.props.getValidationMessages('password')} />
              </div>
              <div className="form-group">
                <input type="password"
                  className="form-control oc-signup-password"
                  placeholder="repeat password"
                  disabled={this.isLoading() ? 'disabled' : ''}
                  value={this.state.password_repeat}
                  onChange={this.handleChangedPasswordRepeat} />
                <Message type="danger" messages={this.props.getValidationMessages('password_repeat')} />
            </div>
            <button type="submit"
              disabled={(this.props.isValid() && this.state.initialized && !this.isLoading()) ? '' : 'disabled'}
              onClick={this.handleSubmitPassword}>Update password</button>
          </div>
        </div>
      );
    } else {
      if (this.state.send) {
        var message = (
          <span>
            <h1>Password request sent!</h1>
            We've emailed you instructions on how to reset your password.
            Don't forget to check your spam folder.
            <br/><br/>
            <button type="submit" onClick={this.handleGoBack}>Still didn't get it? Go back.</button>
          </span>
        );

        return (<Message type="danger" message={message} type="success"/>);
      }

      return (
        <div className="row">
          <div className="col-sm-6">
            <div className="form-group">
                <input type="text"
                  className="form-control"
                  placeholder="email"
                  onChange={this.handleChangedEmail}
                  value={this.state.email}/>
                <Message type="danger" messages={this.props.getValidationMessages('email')} />
            </div>
            <button type="submit"
              disabled={(this.props.isValid() && this.state.initialized && !this.isLoading()) ? '' : 'disabled'}
              onClick={this.handleSubmit}>Send mail</button>
          </div>
        </div>
      );

    }

  }
});

export default validation(strategy)(ForgotPassword);
