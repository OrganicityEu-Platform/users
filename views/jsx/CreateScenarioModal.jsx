import React                from 'react';
import ScenarioEditView                from './scenarios/ScenarioEditView.jsx';
import { Modal, Button, ButtonToolbar } from 'react-bootstrap';

var Router = require('react-router');
var Link = Router.Link;

var CreateScenarioModal = React.createClass({
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
        CREATE MODAL
        </Button>

        <Modal
          {...this.props}
          show={this.state.show}
          onHide={this.hideModal}
          dialogClassName="custom-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-lg">CREATE</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.hideModal}>Close</Button>
          </Modal.Footer>
        </Modal>
      </ButtonToolbar>
    );
  }
});

export default CreateScenarioModal;
