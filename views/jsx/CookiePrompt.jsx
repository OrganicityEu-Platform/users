import React from 'react';
import cookie from 'react-cookie';

var CookiePrompt = React.createClass ({
  getInitialState: function () {
    if (cookie.load('showPrompt') === false) {
      return { show : false };
    }else {
      return { show : true };
    }
  },
  clickHandler: function () {
    this.setState( { show : false } );
    cookie.save('showPrompt', false);
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
                  OrganiCity Scenarios uses cookies to give you an enhanced experience.
                </p>
                <span>
                  Read more about it in our
                </span>
                <span className="pink"> privacy policy</span>
              </div>
              <div className="col-lg-2">
                <button
                  className="oc-button-white"
                  onClick={this.clickHandler}>Dismiss</button>
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
