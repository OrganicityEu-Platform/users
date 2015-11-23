import React              from 'react';
import { Button }         from 'react-bootstrap';
import ui                 from '../../ui_routes.js';

var Router = require('react-router');
var Link = Router.Link;

var HomeViewSection = React.createClass({
  mixins: [Router.Navigation],
  render: function() {
    return (
      <div className="oc-home-view-section-wrapper">
        <div className="row oc-home-view-section-icons-wrapper">
          <div className="col-lg-2"></div>
          <div className="col-lg-2">
            <div className="oc-home-view-section-icon-wrapper">
              <img className="oc-home-view-section-icon" src={ui.asset('static/img/discussion_icon.svg')}/>
              <p>Discussion</p>
            </div>
          </div>
          <span className="oc-home-view-section-plus col-lg-1">+</span>
          <div className="col-lg-2">
            <div className="oc-home-view-section-icon-wrapper">
                <img className="oc-home-view-section-icon" src={ui.asset('static/img/creation_icon.svg')}/>
                <p>Co-creation</p>
            </div>
          </div>
          <span className="oc-home-view-section-plus col-lg-1">+</span>
          <div className="col-lg-2">
            <div className="oc-home-view-section-icon-wrapper">
              <img className="oc-home-view-section-icon" src={ui.asset('static/img/experimentation_icon.svg')}/>
              <p>Experimentation</p>
            </div>
          </div>
          <div className="col-lg-2"></div>
        </div>
        <div className="row oc-home-view-section-signup-wrapper">
            <Button className="oc-ghost-white">
              <div>Sign me up!  <i className="fa fa-chevron-right"></i></div>
            </Button>
        </div>
      </div>
    );
  }
});

export default HomeViewSection;
