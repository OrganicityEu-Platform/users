import $                   from 'jquery';
import React               from 'react';
import UserIsLoggedInMixin from '../UserIsLoggedInMixin.jsx'
import FlashQueue          from '../FlashQueue.jsx';
import LoadingMixin        from '../LoadingMixin.jsx';
import api                 from '../../../api_routes.js';
import ui                  from '../../../ui_routes.js';
import Login               from './Login.jsx';
import { Modal, Button, ButtonToolbar } from 'react-bootstrap';

// Input validation
import validation   from 'react-validation-mixin';
import strategy     from 'joi-validation-strategy';
import UserJoi      from '../../../models/joi/user.js';
import ErrorMessage from '../ErrorMessage.jsx';

var Router = require('react-router');
var Link = Router.Link;

var LocalLogin = React.createClass({
  mixins: [Router.Navigation, UserIsLoggedInMixin, FlashQueue.Mixin, LoadingMixin],
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
  handleSubmit : function(evt) {
    evt.preventDefault();
    this.loading();
    $.ajax(api.reverse('local-login'), {
      error: (xhr, textStatus, errorThrown) => {
        this.loaded();
        if (xhr.status === 422) {
          this.state.error = 'Error logging in: username and/or password unknown';
          this.setState(this.state);
        } else {
          this.flashOnAjaxError(xhr, textStatus, errorThrown);
        }
      },
      success: (currentUser) => {
        this.hideModal();
        this.loaded();
        this.props.onLogin(currentUser);
      },
      method: 'POST',
      data: {
        email: this.state.email,
        password: this.state.password
      }
    });
  },
  render : function() {

    var errorMessage;
    if (this.state.error) {
      errorMessage = (
        <ErrorMessage messages={this.state.error} />
      );
    }

    return (

      <ButtonToolbar>
        <span onClick={this.showModal}>
          login
        </span>

        <Modal
          {...this.props}
          show={this.state.show}
          onHide={this.hideModal}
          dialogClassName="oc-login-modal"
          >
          <Modal.Header closeButton>
            <Modal.Title id="login-modal-title">
              Please login below
            </Modal.Title>
            <Login/>
          </Modal.Header>
          <Modal.Body>
            <div className="col-sm-10 col-sm-offset-1">
              {errorMessage}
              <form
                action={api.reverse('local-login')}
                method="post">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control oc-login-email"
                    placeholder="email"
                    name="email"
                    id="email"
                    disabled={this.isLoading() ? 'disabled' : ''}
                    value={this.state.email}
                    onChange={this.handleChangedEmail} />
                </div>
                <ErrorMessage messages={this.props.getValidationMessages('email')} />
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control oc-login-password"
                    placeholder="password"
                    name="password"
                    id="password"
                    disabled={this.isLoading() ? 'disabled' : ''}
                    value={this.state.password}
                    onChange={this.handleChangedPassword} />
                </div>
                <ErrorMessage messages={this.props.getValidationMessages('password')} />
                <button
                  type="submit"
                  className="login-btn"
                  disabled={(this.props.isValid() && !this.isLoading()) ? '' : 'disabled'}
                  onClick={this.handleSubmit}>Login</button>
              </form>
              <p className="login-help">
                Need an account? <Link to="signup" >
                <span className="login-help-signup">Signup</span>
              </Link>
            </p>
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
    password        : this.state.password
  };
  return data;
},
validatorTypes: UserJoi.emailAndPassword
});

export default validation(strategy)(LocalLogin);
