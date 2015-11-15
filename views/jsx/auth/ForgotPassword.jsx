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
      btnClickedOnce: false
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
    this.setState({
      email : evt.target.value,
    }, () => {
      if (this.state.btnClickedOnce) {
        this.props.validate();
      }
    });
  },
  handleChangedPassword : function(evt) {
    this.setState({
      password : evt.target.value,
    }, () => {
      if (this.state.btnClickedOnce) {
        this.props.validate();
      }
    });
  },
  handleChangedPasswordRepeat : function(evt) {
    this.setState({
      password_repeat : evt.target.value,
    }, () => {
      if (this.state.btnClickedOnce) {
        this.props.validate();
      }
    });
  },
  handleGoBack : function(evt) {
    console.log('Go back');
    this.setState({send: false});
  },
  doPost : function(url, data) {
    this.setState({
      btnClickedOnce: true
    }, () => {
      this.props.validate((error) => {
        if (!error) {
          this.loading();
          $.ajax(url, {
            error: (xhr, textStatus, errorThrown) => {
              this.loaded({
                error: xhr.responseJSON.error,
                send: false
              });
            },
            success: () => {
              this.loaded({send: true});
            },
            method: 'POST',
            data: data
          });
        }
      });
    });
  },
  handleSubmit : function(evt) {
    evt.preventDefault();
    this.doPost(api.reverse('forgot-password'), {
      email: this.state.email
    });
  },
  handleSubmitPassword : function(evt) {
    evt.preventDefault();
    this.doPost(api.reverse('update-password'), {
      id: this.state.id,
      password: this.state.password
    });
  },
  render() {

    var errorMessage = null;
    if (this.state.error) {
      errorMessage = (<Message type="danger" message={this.state.error}/>);
    }

    if (this.state.id) {

      if (this.state.send) {
        return (<Message type="danger" message="Password update successful sent!" type="success"/>);
      }

      return (
        <form>
          <div className="row">
            <div className="col-sm-6 col-sm-offset-3">
              {errorMessage}
              <div className="form-group">
                <input type="password"
                  className="oc-input"
                  placeholder="password"
                  value={this.state.password}
                  disabled={this.isLoading() ? 'disabled' : ''}
                  onChange={this.handleChangedPassword} />
                <Message type="danger" messages={this.props.getValidationMessages('password')} />
              </div>
              <div className="form-group">
                <input type="password"
                  className="oc-input"
                  placeholder="repeat password"
                  disabled={this.isLoading() ? 'disabled' : ''}
                  value={this.state.password_repeat}
                  onChange={this.handleChangedPasswordRepeat} />
                <Message type="danger" messages={this.props.getValidationMessages('password_repeat')} />
              </div>
              <div className="form-group">
                <button
                  type="submit"
                  className = "oc-button"
                  disabled={this.isLoading() ? 'disabled' : ''}
                  onClick={this.handleSubmitPassword}>Update password</button>
              </div>
            </div>
          </div>
        </form>
      );
    } else {
      if (this.state.send) {
        var message = (
          <span>
            <h1>Password request sent!</h1>
            We've emailed you instructions on how to reset your password.
            Don't forget to check your spam folder.
          </span>
        );

        return (
          <div>
            <Message type="danger" message={message} type="success"/>
            <button type="submit" className="oc-button" onClick={this.handleGoBack}>Still didn't get the mail? Go back.</button>
          </div>
        );
      }

      return (
        <form>
          <div className="row">
            <div className="col-sm-6 col-sm-offset-3">
              {errorMessage}
              <div className="form-group">
                <input type="text"
                  className="oc-input"
                  placeholder="email"
                  onChange={this.handleChangedEmail}
                  value={this.state.email}/>
                <Message type="danger" messages={this.props.getValidationMessages('email')} />
              </div>
              <div className="form-group">
                <button type="submit" className="oc-button"
                  disabled={this.isLoading() ? 'disabled' : ''}
                  onClick={this.handleSubmit}>Send mail</button>
              </div>
            </div>
          </div>
        </form>
      );
    }

  }
});

export default validation(strategy)(ForgotPassword);
