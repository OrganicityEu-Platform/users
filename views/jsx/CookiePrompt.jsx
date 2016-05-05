import React from 'react';
import I18nMixin from './i18n/I18nMixin.jsx';

var LocalStorageMixin = require('react-localstorage');
var Router = require('react-router');

var CookiePrompt = React.createClass ({
  mixins: [Router.Navigation, I18nMixin],
  getInitialState: function () {
    if (localStorage.getItem('showOCCookiePrompt')) {
      return { show : false };
    }else {
      return { show : true };
    }
  },
  handlePrivacy: function() {
    this.transitionTo('privacy');
  },
  clickHandler: function () {
    this.setState( { show : false } );
    localStorage.setItem('showOCCookiePrompt', 0);
  },
  render: function () {
    return (
      <div>
        {
          this.state.show ?
          <div className="row oc-cookie-prompt">
            <div className="oc-cookie-prompt-wrapper white">
              <div className="col-lg-2">
                <i className="fa fa-exclamation-triangle oc-cookie-prompt-icon">
                </i>
              </div>
              <div className="col-lg-8">
                <p className="oc-cookie-text">
                  {this.i18n('cookie1', 'OrganiCity Scenarios uses cookies to give you an enhanced experience.')}
                </p>
                <span>{this.i18n('cookie2', 'Read more about it in our')} </span>
                <span onClick={this.handlePrivacy} className="oc-privacy-link">{this.i18n('cookie3', 'privacy policy')}</span>.
              </div>
              <div className="col-lg-2">
                <button
                  className="oc-button-white"
                  onClick={this.clickHandler}>{this.i18n('dismiss', 'Dismiss')}</button>
              </div>
            </div>
          </div>
          : null
        }
      </div>
    );
  }
});

export default CookiePrompt;
