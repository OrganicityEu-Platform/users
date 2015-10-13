import React                from 'react';
import Signup               from './auth/Signup.jsx';
import Login               from './auth/Login.jsx';

import { Modal, Button, ButtonToolbar } from 'react-bootstrap';

var Router = require('react-router');
var Link = Router.Link;

var SignupModal = React.createClass({
  getInitialState: function() {
    return {show: false};
  },

  showModal: function () {
    this.setState({show: true});
  },

  hideModal: function () {
    this.setState({show: false});
  },
  render: function() {
    return (
      <ButtonToolbar>
        <p onClick={this.showModal}>
        register
      </p>

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
            <Signup/>

          </Modal.Body>
          <Modal.Footer>

          </Modal.Footer>
        </Modal>
      </ButtonToolbar>
    );
  }
});

export default SignupModal;
