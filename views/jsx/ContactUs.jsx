import $ from 'jquery';
import React from 'react';
import { Accordion, Panel } from 'react-bootstrap';
import api from '../../api_routes.js';
import { Router, Link } from 'react-router';
import Message from './Message.jsx';
import Joi from 'joi';
import validation from 'react-validation-mixin';
import strategy from 'joi-validation-strategy';
import contactUsValidation from '../../models/joi/contactUs.js';


var myContactForm = React.createClass({
  getInitialState: function() {
    return {
      name: '',
      address: '',
      subject: '',
      body: ''
    };
  },

  nameChanged: function(event) {
    this.setState({name: event.target.value}, state => {
      this.props.validate('name');
    });
  },

  addressChanged: function(event) {
    this.setState({address: event.target.value}, state => {
      this.props.validate('address');
    });
  },

  subjectChanged: function(event) {
    this.setState({subject: event.target.value}, state => {
      this.props.validate('subject');
    });
  },

  bodyChanged: function(event) {
    this.setState({body: event.target.value}, state => {
      this.props.validate('body');
    });
  },

  getContactRecord: function() {
    return {
      name: this.state.name,
      address: this.state.address,
      subject: this.state.subject,
      body: this.state.body
    };
  },

  getValidatorData: function() {
    return this.getContactRecord();
  },

  validatorTypes: contactUsValidation.form,

  submitForm: function() {
    console.log('submitting form', this.state);

    var contactUrl = api.reverse('contactUs');
    $.ajax(contactUrl, {
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(this.getContactRecord()),
      method: 'POST',
      success: this.showSuccessMessage,
      error: this.showErrorMessage
    });
  },

  showSuccessMessage: function(data, textStatus, jqXHR) {
    this.setState({
      error: null,
      success: true
    });
  },

  showErrorMessage: function(jqXHR, textStatus, errorThrown) {
    this.setState({
      error: "Sorry, your Request could not be sent.<br />" +
        "The error message was:<br />" +
        jqXHR.responseText,
      success: false
    });
  },


  render: function() {
    // TODO: Use <Message message={...} type="success" />
    var successMessage = this.state && this.state.successful
        ? (
            <div className="col-sm-12">
            Your message has been sent. Thanks for your feedback!
            <br />
            We will get back to you as soon as possible.
            </div>
        )
        : null;

    var errorMessage = this.state && this.state.error
        ? <Message messages={this.state.error} type="danger" />
        : null;

    var canSubmit = this.props.isValid()
      && this.state !== this.getInitialState();

    return (
      <div>
        <h1>Concat Us</h1>
        <div className="container">
          <div className="col-md-6 oc-contactus-faq">
            <h2>Frequently Asked Questions</h2>

              <Accordion>
                <Panel header={<i className="fa fa-plus oc-faq">
                  How does this FAQ actually work?
                  </i>} eventKey="0">
                  If you click on the headers of these questions, an answer is
                  blended into view just below the header-question. Continue
                  in the same manner for all further questions that you might
                  have about this site.
                </Panel>
              </Accordion>

              <Accordion>
                <Panel header={<i className="fa fa-plus oc-faq">Nulla vitae elit libero, a pharetra augue?</i>} eventKey="0">
                  amus labore sustainable VHS.
                </Panel>
              </Accordion>
              <Accordion>
                <Panel header={<i className="fa fa-plus oc-faq">Nulla vitae elit libero, a pharetra augue?</i>} eventKey="0">
                  amus labore sustainable VHS.
                </Panel>
              </Accordion>

              <Accordion>
                <Panel header={<i className="fa fa-plus oc-faq">
                  But my question is not answered by this FAQ!
                  </i>} eventKey="0">
                  No problem! Please just use the contact form on this page,
                  and we will get back to you as fast as possible.
                </Panel>
              </Accordion>

          </div>
          <div className="col-md-6">
            <h2>Contact</h2>
            <p>
              If you have any questions about managing scenarios, voicing your
              opinion, or this platform in general, do not hesitate to contact
              us:
            </p>
            {errorMessage}

            <form className="form-horizontal">
              <div className="form-group">
                <label className="control-label col-sm-4" htmlFor="name">
                  Your Name
                </label>

                <div className="col-sm-8">
                  <input type="text" className="form-control" name="name"
                    id="name" onChange={this.nameChanged} />
                  <Message type="danger" messages={this.props.getValidationMessages('name')} />
                </div>
              </div>

              <div className="form-group">
                <label className="control-label col-sm-4" htmlFor="address">
                  Your Email Address
                </label>

                <div className="col-sm-8">
                  <input type="text" className="form-control" name="address"
                    id="address" onChange={this.addressChanged} />
                  <Message type="danger" messages={this.props.getValidationMessages('address')} />
                </div>
              </div>

              <div className="form-group">
                <label className="control-label col-sm-4" htmlFor="subject">
                  Subject
                </label>

                <div className="col-sm-8">
                  <input type="text" className="form-control" name="subject"
                    id="subject" onChange={this.subjectChanged} />
                  <Message type="danger" messages={this.props.getValidationMessages('subject')} />
                </div>
              </div>

              <div className="form-group">
                <label className="control-label col-sm-4" htmlFor="body">
                  Message
                </label>

                <div className="col-sm-8">
                  <textarea className="form-control" name="body" id="body"
                    onChange={this.bodyChanged} />
                  <Message type="danger" messages={this.props.getValidationMessages('body')} />
                </div>
              </div>

              <div className="form-group">
                <div className="col-sm-4">
                </div>
                <div className="col-sm-8">
                  <button type="button" className="btn btn-default"
                    onClick={this.submitForm}
                    disabled={canSubmit ? '' : 'disabled'}>
                    Submit
                  </button>
                </div>
              </div>

              <div className="form-group">
                {successMessage}
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
});

export default validation(strategy)(myContactForm);

