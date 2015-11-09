import $ from 'jquery';
import React from 'react';
import { Accordion, Panel } from 'react-bootstrap';
import api from '../../api_routes.js';
import { Router, Link } from 'react-router';
import ErrorMessage from './ErrorMessage.jsx';
import Joi from 'joi';
import validation from 'react-validation-mixin';
import strategy from 'joi-validation-strategy';
import contactUsValidation from '../../models/joi/contactUs.js';
import loggedIn from './UserIsLoggedInMixin.jsx';
import Contact from '../../models/contact.js';


var myContactForm = React.createClass({
  mixins: [loggedIn],

  getInitialState: function() {
    return {
      address: '',
      message: ''
    };
  },

  componentDidMount: function() {
    console.log("will mount.", window.currentUser);

    if (window.currentUser && this.state.address == '') {
      console.log("contactus: current user: ", window.currentUser);
      this.setState({address: window.currentUser.getMailAddress()});
    }
  },

  addressChanged: function(event) {
    this.setState({address: event.target.value}, state => {
      this.props.validate('address');
    });
  },

  messageChanged: function(event) {
    this.setState({message: event.target.value}, state => {
      this.props.validate('message');
    });
  },

  getContactRecord: function() {
    return {
      address: this.state.address,
      message: this.state.message
    };
  },

  getValidatorData: function() {
    return this.getContactRecord();
  },

  validatorTypes: contactUsValidation.form,

  submitForm: function() {
    console.log('submitting form', this.getContactRecord());

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
    if (typeof this.props.currentUser == 'undefined')
    {
      return (<div>
          <h4>Contact Us</h4>
          <a href={'mailto:' + Contact.mailAddress}>
            {Contact.mailAddress}
          </a>
        </div>);
    }

    var userMail = // this.props.currentUser.getMailAddress();
      'user@mail.com';

    var successMessage = this.state && this.state.successful
        ? (
            <div>
              Your message has been sent. Thank you for your feedback!
              <br />
              We will get back to you as soon as possible.
            </div>
        )
        : null;

    var errorMessage = this.state && this.state.error
        ? <ErrorMessage messages={this.state.error} />
        : null;

    var canSubmit = this.props.isValid()
      && this.state !== this.getInitialState();

    return (
      <div>
        <h4>Contact Us</h4>
        <form className="form-horizontal">
          <div className="form-group">
            <input type="text" className="form-control" name="address"
              placeholder="Your Email Address" value={userMail}
              id="address" onChange={this.addressChanged} />
            <ErrorMessage
              messages={this.props.getValidationMessages('address')} />
          </div>

          <div className="form-group">
            <textarea className="form-control" name="body" id="body"
              placeholder="Your Message"
              onChange={this.bodyChanged} />
            <ErrorMessage
              messages={this.props.getValidationMessages('body')} />
          </div>

          <div className="form-group">
            <button type="button" className="btn btn-default"
              onClick={this.submitForm}
              disabled={canSubmit ? '' : 'disabled'}>
              Submit
            </button>
          </div>

          <div className="form-group">
            {errorMessage}
            {successMessage}
          </div>
        </form>
      </div>
    );
  }
});

export default validation(strategy)(myContactForm);

