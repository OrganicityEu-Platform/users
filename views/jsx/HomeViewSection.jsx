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
        <div className="col-lg-8 col-lg-offset-2">
            <div className="oc-home-view-section-icon-wrapper">
              <img className="oc-home-view-section-icon" src={ui.asset('static/img/discussion_icon.svg')}/>
              <p className="oc-home-view-section-icon-text">Discussion</p>

          </div>

          <span className="oc-home-view-section-plus">+</span>


            <div className="oc-home-view-section-icon-wrapper">
                <img className="oc-home-view-section-icon" src={ui.asset('static/img/creation_icon.svg')}/>
                <p className="oc-home-view-section-icon-text">Co-creation</p>
            </div>

          <span className="oc-home-view-section-plus">+</span>


            <div className="oc-home-view-section-icon-wrapper">
              <img className="oc-home-view-section-icon" src={ui.asset('static/img/experimentation_icon.svg')}/>
              <p className="oc-home-view-section-icon-text">Experimentation</p>
            </div>

    </div>
        </div>
        <div className="row oc-home-view-section-signup-wrapper">
            <Button className="oc-ghost-white" id="oc-home-view-signup-btn">
              <div>Sign me up!  <i className="fa fa-chevron-right"></i></div>
            </Button>
            <i className="fa fa-angle-double-down white"></i>
        </div>

      </div>
    );
  }
});

export default HomeViewSection;
