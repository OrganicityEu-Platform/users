
import TimeAgo            from 'react-timeago';
import api                from '../../../api_routes.js';
import ui                 from '../../../ui_routes.js';
import React              from 'react';
import UserAvatar         from '../users/UserAvatar.jsx';
import ellipsis           from '../../../util/ellipsis.js';
import Score              from '../Score.jsx';
import ScenarioIndicator  from './ScenarioIndicator.jsx';
import ScenarioRating     from './ScenarioRating.jsx';

var Router = require('react-router');
var Link = Router.Link;

var ScenarioThumbnail = React.createClass({

  mixins: [Router.Navigation],

  render: function() {
    var sectors = this.props.scenario.sectors.slice(0, 3).join(', ');
    var actors = this.props.scenario.actors.slice(0, 3).join(', ');
    var tools = this.props.scenario.devices.slice(0, 3).join(', ');
    var summary = ellipsis(this.props.scenario.summary, 160);
    var sector_colour = this.props.scenario.sectors[0];
    var sector_colour_marker;
    var sector_colour_overlay;
    var sector_icon;
    var fixed_sectors = ['transport', 'retail', 'energy', 'environment', 'agriculture', 'healthcare', 'cultural', 'public'];

    var arrayContains;

    if (sector_colour) {
      sector_colour_marker = sector_colour.toLowerCase().concat('_colour scenario-thumbnail-marker');
      sector_colour_overlay = sector_colour.toLowerCase().concat('_colour scenario-thumbnail-image-wrapper');
      arrayContains = (fixed_sectors.indexOf(sector_colour.toLowerCase()) > -1);
    }else {
      console.log("no color");
    }

    if(arrayContains) {
      sector_icon = sector_colour.toLowerCase().concat('_icon.svg');
    }else {
      sector_icon = 'generic_sector_icon.svg';
    }

    var thumbnail;
    if (this.props.scenario.thumbnail) {
      thumbnail = (<img src={ui.asset(this.props.scenario.thumbnail)} width="100%"/>);
    }

    return (
      <div className="col-md-4">
        <div className="well scenario-thumbnail">
          <Link to="scenarioView" params={{ uuid: this.props.scenario.uuid }}>
            <div>
              <div className={sector_colour_marker}>
                <span className="scenario-thumbnail-marker-score">
                  <img className="oc-tag-icon" src={ui.asset('static/img/'.concat(sector_icon))}/>
                </span>
              </div>
            </div>
            <header className="scenario-thumbnail-header">
              <span>
                <span className="scenario-thumbnail-timestamp">
                  { this.props.scenario.timestamp ?
                    <TimeAgo date={this.props.scenario.timestamp} />
                    : '' }
                </span>
                <div className="oc-thumbnail-rating-wrapper">
                  <ScenarioRating
                    scenario={this.props.scenario}
                    className={"oc-thumbnail-star"} />
                </div>
                <ScenarioIndicator
                  evaluations={userEvaluations}
                  scenario={this.props.scenario}
                  showEvalText={true} />
              </span>
              <h3 className="scenario-thumbnail-title">
                {this.props.scenario.title}
              </h3>
              <span className="scenario-thumbnail-publisher-wrapper">
                <span className="meta">Posted by: </span>
                <span className="scenario-thumbnail-publisher">
                  <UserAvatar uuid={this.props.scenario.creator}
                    name={this.props.scenario.creatorName} />
                </span>
              </span>
            </header>
            <p className="scenario-thumbnail-summary">
              {summary}
            </p>

            <span className="scenario-thumbnail-sat-wrapper">
              <span>Participants: {actors}</span>
              <span>Sectors: {sectors}</span>
              <span>Tools: {tools}</span>
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

export default ScenarioThumbnail;
