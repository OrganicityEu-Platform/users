import React                from 'react';
import { Button, Accordion, Panel } from 'react-bootstrap';

var Router = require('react-router');
var Link = Router.Link;

var HomeViewFooter = React.createClass({
  mixins: [Router.Navigation],
  render: function() {
    return (
      <div className="col-lg-8 col-lg-offset-2">
        <div className="oc-home-view-footer-wrapper">
          <div className="oc-home-view-footer">
            <div className="oc-home-view-title-wrapper">
              <div className="oc-home-view-title">
                <h1>Co-creating cities of the future</h1>
              </div>
            </div>
            <div className="col-md-6">
              <p>Vestibulum id ligula porta felis euismod semper. Donec ullamcorper nulla non metus auctor fringilla. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Donec sed odio dui. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p>
            </div>
            <div className="col-md-6">
              <p>Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Maecenas faucibus mollis interdum. Maecenas sed diam eget risus varius blandit sit amet non magna. Nullam id dolor id nibh ultricies vehicula ut id elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae elit libero, a pharetra augue. Maecenas sed diam eget risus varius blandit sit amet non magna.</p>
            </div>
            <div className="col-md-6">
              <Accordion className="oc-top-accordian">
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
                <Panel header={<i className="fa fa-plus oc-faq">Nulla vitae elit libero, a pharetra augue?</i>} eventKey="0">
                  amus labore sustainable VHS.
                </Panel>
              </Accordion>
              <Accordion>
                <Panel header={<i className="fa fa-plus oc-faq">Nulla vitae elit libero, a pharetra augue?</i>} eventKey="0">
                  amus labore sustainable VHS.
                </Panel>
              </Accordion>
            </div>
            <div className="col-md-6">
              <Accordion className="oc-top-accordian">
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
                <Panel header={<i className="fa fa-plus oc-faq">Nulla vitae elit libero, a pharetra augue?</i>} eventKey="0">
                  amus labore sustainable VHS.
                </Panel>
              </Accordion>
              <Accordion>
                <Panel header={<i className="fa fa-plus oc-faq">Nulla vitae elit libero, a pharetra augue?</i>} eventKey="0">
                  amus labore sustainable VHS.
                </Panel>
              </Accordion>
            </div>
            <div id="oc-home-view-section-read-more-btn-wrapper">
              <div className="col-md-4"></div>
              <div className="col-md-4">
                <a href="http://organicity.eu" target="_blank">
                  <Button id="oc-home-view-section-read-more-btn">READ MORE ABOUT ORGANICITY</Button>
                </a>
              </div>
              <div className="col-md-4"></div>
            </div>
          </div>
        </div>
      </div>

    );
  }
});

export default HomeViewFooter;
