import $            from 'jquery';
import React        from 'react';
import FlashQueue   from '../FlashQueue.jsx';
import LoadingMixin from '../LoadingMixin.jsx';
import api          from '../../../api_routes.js';
import ui           from '../../../ui_routes.js';
import Login               from './Login.jsx';
import LocalLogin   from './LocalLogin.jsx';
import { Modal, Button, ButtonToolbar } from 'react-bootstrap';

// Input validation
import validation   from 'react-validation-mixin';
import strategy     from 'joi-validation-strategy';
import UserJoi      from '../../../models/joi/user.js';
import ErrorMessage from '../ErrorMessage.jsx';

var Router = require('react-router');
var Link = Router.Link;
var Navigation = Router.Navigation;

var Signup = React.createClass({
  mixins: [Navigation, FlashQueue.Mixin, LoadingMixin],
  showModal: function () {
    this.setState({show: true});
  },
  hideModal: function () {
    this.setState({show: false});
  },
  getInitialState : function() {
    return {
      email : '',
      password : '',
      password_repeat : '',
      error : null,
      show: false
    };
  },
  handleChangedEmail : function(evt) {
    this.state.email = evt.target.value;
    this.setState(this.state);
    this.props.validate();
  },
  handleChangedPassword : function(evt) {
    this.state.password = evt.target.value;
    this.setState(this.state);
    this.props.validate();
  },
  handleChangedPasswordRepeat : function(evt) {
    this.state.password_repeat = evt.target.value;
    this.setState(this.state);
    this.props.validate();
  },
  handleSubmit : function(evt) {
    evt.preventDefault();
    if (this.props.isValid()) {
      var url = api.reverse('signup');
      $.ajax(url, {
        error: (xhr, textStatus, errorThrown) => {
          this.loaded();
          var error = JSON.parse(xhr.responseText);
          if (xhr.status === 422) {
            this.state.error = error.message;
            this.setState(this.state);
          } else {
            this.flashOnAjaxError(xhr, textStatus, errorThrown);
          }
        },
        success: (currentUser) => {
          this.hideModal();
          this.loaded();
          this.props.onLogin(currentUser);
          this.transitionTo(ui.route('profile'));
        },
        method: 'POST',
        data: {
          email: this.state.email,
          password: this.state.password
        }
      });
    }
  },
  render : function() {

    var errorMessage;
    if (this.state.error) {
      errorMessage = (<ErrorMessage messages={this.state.error} />);
    }

    return (

      <ButtonToolbar>
        <span onClick={this.showModal}>
        signup
      </span>

        <Modal
          {...this.props}
          show={this.state.show}
          onHide={this.hideModal}
          dialogClassName="oc-signup-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title id="signup-modal-title">Please register below</Modal.Title>
              <Login/>
          </Modal.Header>
          <Modal.Body>
            <div className="col-sm-10 col-sm-offset-1">
              {errorMessage}
              <form action={api.reverse('signup')} method="post">
                  <div className="form-group">
                      <input type="text"
                        className="form-control oc-signup-email"
                        name="email"
                        placeholder="email"
                        value={this.state.email}
                        disabled={this.isLoading() ? 'disabled' : ''}
                        onChange={this.handleChangedEmail} />
                      <ErrorMessage messages={this.props.getValidationMessages('email')} />
                  </div>
                  <div className="form-group">
                      <input type="password"
                        className="form-control oc-signup-password"
                        name="password"
                        placeholder="password"
                        value={this.state.password}
                        disabled={this.isLoading() ? 'disabled' : ''}
                        onChange={this.handleChangedPassword} />
                      <ErrorMessage messages={this.props.getValidationMessages('password')} />
                  </div>
                  <div className="form-group">
                      <input type="password"
                        className="form-control oc-signup-password"
                        name="password_repeat"
                        placeholder="repeat password"
                        disabled={this.isLoading() ? 'disabled' : ''}
                        value={this.state.password_repeat}
                        onChange={this.handleChangedPasswordRepeat} />
                      <ErrorMessage messages={this.props.getValidationMessages('password_repeat')} />
                  </div>
                  <button type="submit"
                    className="signup-btn"
                    disabled={(this.props.isValid() && !this.isLoading()) ? '' : 'disabled'}
                    onClick={this.handleSubmit}>Signup</button>
              </form>
              <p className="signup-help">Already have an account? <span className="login-help-signup"><LocalLogin/></span></p>
            </div>
          </Modal.Body>
          <Modal.Footer>

          </Modal.Footer>
        </Modal>
      </ButtonToolbar>
    );
  },
  getValidatorData: function() {
    var data = {
      email           : this.state.email,
      password        : this.state.password,
      password_repeat : this.state.password_repeat
    };
    return data;
  },
  validatorTypes: UserJoi.signupClient
});

export default validation(strategy)(Signup);
