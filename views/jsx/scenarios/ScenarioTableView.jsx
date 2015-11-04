import React      from 'react';
import TimeAgo    from 'react-timeago';
import ui         from '../../../ui_routes.js';
import UserAvatar from '../users/UserAvatar.jsx';
import Counter    from '../Counter.jsx';
import Score    from '../Score.jsx';
import Comments    from '../Comments.jsx';
import Evaluations    from '../Evaluations.jsx';
import ScenarioEvalButton from './ScenarioEvalButton.jsx';
import api                  from '../../../api_routes.js';

import LoadingMixin     from '../LoadingMixin.jsx';

var ScenarioTableView = React.createClass({
  mixins: [LoadingMixin],
  render: function() {
    if (!this.props.scenario) {
      return null;
    }

    console.log('Scenario', this.props.scenario)

    var image = this.props.scenario.image;
    if (image && (image.startsWith('uploads/') || image.startsWith('tmp/'))) {
      image = (<img src={ui.asset(this.props.scenario.image)} width="100%"/>);
    } else {
      image = undefined;
    }

    var sector_colour = this.props.scenario.sectors[0];
    var sector_colour_marker;
    var article_image_overlay;
    if (sector_colour) {
      article_image_overlay = sector_colour.toLowerCase().concat('_colour scenario-article-image');
      sector_colour_marker = sector_colour.toLowerCase().concat('_colour scenario-article-marker');
    }else {
      sector_colour_marker = 'scenario-article-marker';
    }

    var credit;
    if (this.props.scenario.credit) {
      credit = (
        <div className="col-md-12">
          <div className="scenario-article-ast-wrapper">
            <span className="scenario-ast">Credit:</span>
            <span className="scenario-ast-items">{this.props.scenario.credit}</span><br></br>
          </div>
        </div>
      );
    }

    var copyright;
    if (this.props.scenario.copyright) {
      copyright = (
        <div className="col-md-12 scenario-article-copyright">
          &copy; {this.props.scenario.copyright}
        </div>
      );
    }


    return (
      <div>
      <div className="scenario-article">
        <div>
          <div className={sector_colour_marker}><span className="scenario-article-score"><Score scope="scenarios" className="scenario-article-score" id={this.props.scenario.uuid} /></span></div>
          <div className="scenario-article-widget">
            <div className="scenario-article-widget-data">
              <p className="scenario-article-widget-data-views"><i className="fa fa-eye"></i><Counter scope="scenarios" className="scenario-article-views" id={this.props.scenario.uuid} />  views</p>
              <p className="scenario-article-widget-data-comments"><i className="fa fa-comment-o"></i><Comments scope="scenarios" className="scenario-article-comments" id={this.props.scenario.uuid} />  comments</p>
              <p className="scenario-article-widget-data-evaluations"><i className="fa fa-circle"></i><Evaluations scope="scenarios" className="scenario-article-evaluations" id={this.props.scenario.uuid} />  evaluations</p>
            </div>
          </div>

        </div>

        <header className="container">
          <h2 className="scenario-article-title">{this.props.scenario.title}</h2>
          <div>
            <span className="scenario-article-publisher">
              Created by <UserAvatar uuid={this.props.scenario.creator} />
            </span>
            <span className="scenario-article-timestamp">
              { this.props.scenario.timestamp ?
                <TimeAgo date={this.props.scenario.timestamp} />
                : '' }
            </span>
          </div>

          <div className="">
            <p className="scenario-article-summary">
              {this.props.scenario.summary}
            </p>
          </div>
        </header>
        <div className="scenario-article-section">
          <div className={article_image_overlay}>
            {image}
          </div>
          {copyright}
          <div className="scenario-article-meta">
            <div className="col-md-4">
              <div className="scenario-ast-wrapper">
                <span className="scenario-ast">Actors:</span>
                <span className="scenario-ast-items">{this.props.scenario.actors ? this.props.scenario.actors.join(', ') : ''}</span><br></br>
              </div>

            </div>
            <div className="col-md-4">
              <div className="scenario-ast-wrapper">
                <span className="scenario-ast">Sectors:</span>
                <span className="scenario-ast-items">{this.props.scenario.sectors ? this.props.scenario.sectors.join(', ') : ''}</span><br></br>
              </div>
            </div>
            <div className="col-md-4">
              <div className="scenario-ast-wrapper">
                <span className="scenario-ast">Tools:</span>
                <span className="scenario-ast-items">{this.props.scenario.devices ? this.props.scenario.devices.join(', ') : ''}</span><br></br>
              </div>
            </div>
            {credit}
          </div>
        </div>

        <footer className="scenario-article-footer">

        </footer>
      </div>
      <div className="scenario-article-narrative-wrapper container">
          <span className="col-md-1">Narrative</span>
          <div className="scenario-article-narrative col-md-11">
            {this.props.scenario.narrative}
          </div>
      </div>
      <div className="col-md-3"></div>
      <div className="col-md-2"></div>
      <div className="col-md-2">
        <ScenarioEvalButton scenario={this.props.scenario}/>
      </div>
      <div className="col-md-2"></div>
      <div className="col-md-3"></div>
    </div>
    );
  }
});

export default ScenarioTableView;
