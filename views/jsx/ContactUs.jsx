import React from 'react';
import { Accordion, Panel } from 'react-bootstrap';

var Router = require('react-router');
var Link = Router.Link;

export default React.createClass({
  render: function() {
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
            <form className="form-horizontal">
              <div className="form-group">
                <label className="control-label col-sm-4" htmlFor="subject">
                  Subject
                </label>

                <div className="col-sm-8">
                  <input type="text" className="form-control" name="subject"
                    id="subject" />
                </div>
              </div>

              <div className="form-group">
                <label className="control-label col-sm-4" htmlFor="body">
                  Message
                </label>

                <div className="col-sm-8">
                  <textarea className="form-control" name="body" id="body" />
                </div>
              </div>

              <div className="form-group">
                <div className="col-sm-4">
                </div>
                <div className="col-sm-8">
                  <button type="button" className="btn btn-default"
                    onClick={this.clickedSubmit}>
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
});
