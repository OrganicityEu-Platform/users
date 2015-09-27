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
          dialogClassName="custom-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-lg">Login</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Login/>
            <LocalLogin/>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.hideModal}>Close</Button>
          </Modal.Footer>
        </Modal>
      </ButtonToolbar>
    );
  }
});

export default LoginModal;
