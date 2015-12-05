import React from 'react';

var CookiePrompt = React.createClass ({
  getInitialState: function () {
    {/* CHECK FOR SAVED COOKIE HERE*/}
    return { show : true };
  },
  clickHandler: function () {
    this.setState( { show : false } );
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
                  OrganiCity Scenarios uses cookies to give you and enhanced experience.
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
