
import TimeAgo    from 'react-timeago';
import api        from '../../../api_routes.js';
import ui         from '../../../ui_routes.js';
import React      from 'react';
import UserAvatar from '../users/UserAvatar.jsx';
import ellipsis   from '../../../util/ellipsis.js';
import Score      from '../Score.jsx';
var Router = require('react-router');
var Link = Router.Link;

var ReportThumbnail = React.createClass({

  mixins: [Router.Navigation],

  render: function() {
    // var sectors = this.props.scenario.sectors.slice(0, 3).join(', ');
    // var actors = this.props.scenario.actors.slice(0, 3).join(', ');
    // var tools = this.props.scenario.devices.slice(0, 3).join(', ');
    var summary = ellipsis(this.props.report.abstract, 160);
    // var sector_colour = this.props.scenario.sectors[0];
    // var sector_colour_marker;
    // var sector_colour_overlay;

    // if (sector_colour) {
    //   sector_colour_marker = sector_colour.toLowerCase().concat('_colour scenario-thumbnail-marker');
    //   sector_colour_overlay = sector_colour.toLowerCase().concat('_colour scenario-thumbnail-image-wrapper');
    // }
    var sector_colour_marker = 'public_colour scenario-thumbnail-marker'; // TODO ...
    var sector_colour_overlay = 'public_colour scenario-thumbnail-image-wrapper';  // TODO ...

    var thumbnail;
    if (this.props.report.thumbnail) {
      thumbnail = (<img src={ui.asset(this.props.report.thumbnail)} width="100%"/>);
    }

    return (
      <div className="col-md-4">
        <div className="well scenario-thumbnail">
          <Link to="reportView" params={{ uuid: this.props.report.uuid }}>
            <div>
              <div className={sector_colour_marker}>
                <span className="scenario-thumbnail-marker-score">
                  <Score className="scenario-article-score-thumbnail" score={this.props.report.score} />
                </span>
              </div>
            </div>
            <header className="scenario-thumbnail-header">
              <span>
                <span className="scenario-thumbnail-timestamp">
                  { this.props.report.timestamp ?
                    <TimeAgo date={this.props.report.timestamp} />
                    : '' }
                </span>
              </span>
              <h3 className="scenario-thumbnail-title">
                {this.props.report.title}
              </h3>
              <span className="scenario-thumbnail-publisher-wrapper">
                <span className="meta">Posted by: </span>
                <span className="scenario-thumbnail-publisher">
                  <UserAvatar uuid={this.props.report.creator}
                    name={this.props.report.creatorName} />
                </span>
              </span>
            </header>
            <p className="scenario-thumbnail-summary">
              {summary}
            </p>
            <span className="scenario-thumbnail-sat-wrapper">
              <span>Sectors: ...</span>
              <span>Actors: ...</span>
              <span>Tools: ...</span>
            </span>
            <div className={sector_colour_overlay}>
              {thumbnail}
            </div>
          </Link>
        </div>
      </div>
    );
  }
});

export default ReportThumbnail;
