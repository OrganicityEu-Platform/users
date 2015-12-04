import $ from 'jquery';
import React from 'react';
import { Accordion, Panel } from 'react-bootstrap';
import api from '../../api_routes.js';
import { Router, Link } from 'react-router';
import Message from './Message.jsx';
import Joi from 'joi';
import validation from 'react-validation-mixin';
import strategy from 'joi-validation-strategy';
import ContactUsValidation from '../../models/joi/contactUs.js';
import Contact from '../../models/contact.js';
import User from '../../logic/user.js';

import UserIsLoggedInMixin from './UserIsLoggedInMixin.jsx';
import LoadingMixin from './LoadingMixin.jsx';

var myContactForm = React.createClass({
  mixins: [UserIsLoggedInMixin, LoadingMixin],

  getInitialState: function() {
    return {
      address: '',
      addressIsSetByUser: false,
      message: '',
      error: null,
      success: false,
      btnClickedOnce: false
    };
  },

  addressChanged: function(event) {
    this.setState({
      address: event.target.value,
      addressIsSetByUser: true
    }, () => {
      if (this.state.btnClickedOnce) {
        this.props.validate();
      }
    });
  },

  messageChanged: function(event) {
    this.setState({message: event.target.value}, () => {
      if (this.state.btnClickedOnce) {
        this.props.validate();
      }
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

  submitForm: function(evt) {
    this.props.validate(error => {
      this.setState({btnClickedOnce: true});
      if (!error) {
        this.loading();
        $.ajax(api.reverse('contactUs'), {
          dataType: 'json',
          contentType: 'application/json',
          data: JSON.stringify(this.getContactRecord()),
          method: 'POST',
          success: this.showSuccessMessage,
          error: this.showErrorMessage
        });
      }
    });
  },

  showSuccessMessage: function(data, textStatus, jqXHR) {
   this.loaded({
      error: null,
      success: true
    });
  },

  showErrorMessage: function(jqXHR, textStatus, errorThrown) {
     this.loaded({
      error: jqXHR.responseText,
      success: false
    });
  },

  resetForm: function() {
    console.log("reseting form.");
    this.setState(this.getInitialState());
  },

  getMailAddress: function() {
    var getDefaultAddress =
      !this.state.addressIsSetByUser && this.state.address == ''
      && typeof this.props.currentUser != 'undefined';

    return getDefaultAddress
      ? User.getMailAddress(this.props.currentUser)
      : this.state.address;
  },

  isSubmitted: function() {
    return this.state.error || this.state.success;
  },

  hasErrors: function() {
    return this.isSubmitted() && this.state.error;
  },

  render: function() {
    if (typeof this.props.currentUser == 'undefined')
    {
      return (<div>
          <a className="white" href={'mailto:' + Contact.mailAddress}>
            {Contact.mailAddress}
          </a>
        </div>);
    }

    var errorMessage = null;
    if (this.isSubmitted())
    {
      if (this.hasErrors()) {
        errorMessage = (<Message type="danger" message={this.state.error} />);
      } else {
        return (
          <div onClick={this.resetForm}>
            <Message type="success" message="Your message has been sent. Thank you for your feedback! We will get back to you as soon as possible." />
          </div>
        );
      }
    }

    return (
      <div>
        <form className="form">
          {errorMessage}
          <div className="form-group">
            <input
              type="text"
              className="form-control oc-input"
              name="address"
              placeholder="Your Email Address"
              value={this.getMailAddress()}
              id="address"
              onChange={this.addressChanged}
              disabled={this.isLoading() ? 'disabled' : ''}
            />
            <Message type="danger"
              messages={this.props.getValidationMessages('address')} />
          </div>

          <div className="form-group">
            <textarea
              className="form-control oc-input"
              name="message"
              id="message"
              placeholder="Your Message"
              onChange={this.messageChanged}
              disabled={this.isLoading() ? 'disabled' : ''}
            />
            <Message type="danger"
              messages={this.props.getValidationMessages('message')} />
          </div>

          <div className="form-group">
            <div className="col-lg-5 oc-contact-submit-btn-wrapper">
              <button type="button" className="oc-button btn-default"
                onClick={this.submitForm}
                disabled={this.isLoading() ? 'disabled' : ''}
              >
                Submit
              </button>
            </div>
            <div className="col-lg-7"></div>
        </div>

        </form>
      </div>
    );
  }
});

export default validation(strategy)(myContactForm);
