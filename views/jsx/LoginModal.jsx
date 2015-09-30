import React                from 'react';
import Login               from './auth/Login.jsx';
import LocalLogin               from './auth/LocalLogin.jsx';

import { Modal, Button, ButtonToolbar } from 'react-bootstrap';

var Router = require('react-router');
var Link = Router.Link;

var LoginModal = React.createClass({
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
        <Button bsStyle="primary" onClick={this.showModal}>
        Login Modal
        </Button>

        <Modal
          {...this.props}
          show={this.state.show}
          onHide={this.hideModal}
          dialogClassName="oc-login-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-lg">Please login below</Modal.Title>
          </Modal.Header>
          <Modal.Body>

          </Modal.Body>
          <Modal.Footer>

          </Modal.Footer>
        </Modal>
      </ButtonToolbar>
    );
  }
});

export default LoginModal;
