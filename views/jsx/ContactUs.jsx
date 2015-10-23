import React from 'react';

var Router = require('react-router');
var Link = Router.Link;

export default React.createClass({
  render: function() {
    return (
      <div>
        <h1>Concat Us</h1>
        <div className="container">
          <div className="col-md-6">
            FAQ?
          </div>
          <div className="col-md-6">
            If you have any questions about managing scenarios, voicing your
            opinion, or this platform in general, do not hesitate to contact us:
            <div className="row well">

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
      </div>
    );
  }
});
