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
            <h1 className="oc-home-view-title">Co-creating cities of the future</h1>
            <div className="col-md-8 col-md-offset-2">
              <p>As the OrganiCity smart platform is being built, to meet the vision set through citizen discussions, constant input and feedback is required and encouraged. What data do you need? What devices do you wish to connect? How should OrganiCity call for experiments? How can we make that experimentation easier? Together, the city, businesses, researchers and citizens can create a better, more inclusive, more accessible smart city.</p>
            </div>
            {/*
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
            */}
            <div className="col-md-4 col-md-offset-4">
              <a href="http://organicity.eu" target="_blank">
                <Button className="oc-button">READ MORE ABOUT ORGANICITY</Button>
              </a>
            </div>
          </div>
        </div>
      </div>

    );
  }
});

export default HomeViewFooter;
