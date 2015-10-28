import React      from 'react';
import TimeAgo    from 'react-timeago';
import ui         from '../../../ui_routes.js';
import UserAvatar from '../users/UserAvatar.jsx';
import Counter    from '../Counter.jsx';
import ScenarioEvalButton from './ScenarioEvalButton.jsx';
import api                  from '../../../api_routes.js';

import LoadingMixin     from '../LoadingMixin.jsx';

var ScenarioTableView = React.createClass({
  mixins: [LoadingMixin],
  render: function() {
    if (!this.props.scenario) {
      return null;
    }

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
    }

    return (
      <div>
      <div className="scenario-article">
        <div>
          <div className={sector_colour_marker}><span className="scenario-article-score">29</span></div>
          <div className="scenario-article-widget">
            <div className="scenario-article-widget-data">
              <p className="scenario-article-widget-data-views"><i className="fa fa-eye"></i><Counter scope="scenarios" className="scenario-article-views" id={this.props.scenario.uuid} />  views</p>
              <p className="scenario-article-widget-data-comments"><i className="fa fa-comment-o"></i>29  comments</p>
              <p className="scenario-article-widget-data-evaluations"><i className="fa fa-circle"></i> 29  evaluations</p>
            </div>
          </div>

        </div>

        <header className="container">
          <h2 className="">{this.props.scenario.title}</h2>
          <span className="scenario-article-publisher">
            Created by <UserAvatar uuid={this.props.scenario.creator} />
          </span>
          <span className="scenario-article-timestamp">
            { this.props.scenario.timestamp ?
              <TimeAgo date={this.props.scenario.timestamp} />
              : '' }
          </span>
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
    </div>
    );
  }
});

export default ScenarioTableView;
