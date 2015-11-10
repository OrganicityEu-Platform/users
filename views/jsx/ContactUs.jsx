import $ from 'jquery';
import React from 'react';
import { Accordion, Panel } from 'react-bootstrap';
import api from '../../api_routes.js';
import { Router, Link } from 'react-router';
import ErrorMessage from './ErrorMessage.jsx';
import Joi from 'joi';
import validation from 'react-validation-mixin';
import strategy from 'joi-validation-strategy';
import ContactUsValidation from '../../models/joi/contactUs.js';
import loggedIn from './UserIsLoggedInMixin.jsx';
import Contact from '../../models/contact.js';
import User from '../../logic/user.js';

var myContactForm = React.createClass({
  mixins: [loggedIn],

  getInitialState: function() {
    return {
      address: '',
      addressIsSetByUser: false,
      message: '',
      error: null,
      success: false
    };
  },

  addressChanged: function(event) {
    this.setState({
      address: event.target.value,
      addressIsSetByUser: true
    }, state => {
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
      address: this.getMailAddress(),
      message: this.state.message
    };
  },

  getValidatorData: function() {
    return this.getContactRecord();
  },

  validatorTypes: ContactUsValidation.form.body,

  submitForm: function() {
    this.props.validate(error => {
      if (error) {
        return;
      }

      var contactUrl = api.reverse('contactUs');
      $.ajax(contactUrl, {
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(this.getContactRecord()),
        method: 'POST',
        success: this.showSuccessMessage,
        error: this.showErrorMessage
      });
    });
  },

  showSuccessMessage: function(data, textStatus, jqXHR) {
    this.setState({
      addressIsSetByUser: false,
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

  getMailAddress: function() {
    var getDefaultAddress =
      !this.state.addressIsSetByUser && this.state.address == ''
      && typeof this.props.currentUser != 'undefined';

    return getDefaultAddress
      ? User.getMailAddress(this.props.currentUser)
      : this.state.address;
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

    var successMessage = this.state && this.state.success
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

    var canSubmit = this.props.isValid();

    return (
      <div>
        <h4>Contact Us</h4>
        <form className="form-horizontal">
          <div className="form-group">
            <input type="text" className="form-control" name="address"
              placeholder="Your Email Address" value={this.getMailAddress()}
              id="address" onChange={this.addressChanged} />
            <ErrorMessage
              messages={this.props.getValidationMessages('address')} />
          </div>

          <div className="form-group">
            <textarea className="form-control" name="message" id="message"
              placeholder="Your Message"
              onChange={this.messageChanged} />
            <ErrorMessage
              messages={this.props.getValidationMessages('message')} />
          </div>

          <div className="form-group">
            {errorMessage}
            {successMessage}
          </div>

          <div className="form-group">
            <button type="button" className="btn btn-default"
              onClick={this.submitForm}
              disabled={canSubmit ? '' : 'disabled'}>
              Submit
            </button>
          </div>
        </form>
      </div>
    );
  }
});

export default validation(strategy)(myContactForm);

