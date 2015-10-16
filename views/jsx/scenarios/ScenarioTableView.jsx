import React      from 'react';
import TimeAgo    from 'react-timeago';
import ui         from '../../../ui_routes.js';
import UserAvatar from '../users/UserAvatar.jsx';
import Counter    from '../Counter.jsx';
import ScenarioEvalButton from './ScenarioEvalButton.jsx';
import api                  from '../../../api_routes.js';

var ScenarioTableView = React.createClass({
  render: function() {
    if (!this.props.scenario) {
      return null;
    }

    var thumbnail = this.props.scenario.thumbnail;
    if (thumbnail && thumbnail.startsWith('uploads/')) {
      thumbnail = (<img src={ui.asset(this.props.scenario.thumbnail)} width="100%"/>);
    } else if (thumbnail) {
      thumbnail = (<img src={this.props.scenario.thumbnail} width="100%"/>);
    }

    return (
      <div className="scenario-article">
        <header className="scenario-article-header">

          <div className="col-md-10 header-meta">
            <h2 className="scenario-article-title">{this.props.scenario.title}</h2>
              <span className="scenario-article-publisher">
                Created by <UserAvatar uuid={this.props.scenario.creator} />
              </span>
              <span className="scenario-article-timestamp">
                { this.props.scenario.timestamp ?
                <TimeAgo date={this.props.scenario.timestamp} />
                : '' }
              </span>
              <p className="scenario-article-summary">
                {this.props.scenario.summary}
              </p>
          </div>
          <div className="col-md-2 scenario-article-widget">
            <ScenarioEvalButton scenario={this.props.scenario}/>
            <div className="scenario-article-widget-data">
              <p className="scenario-article-widget-data-score">SCORE:</p>
              <p className="scenario-article-widget-data-views"><i className="fa fa-eye"></i><Counter scope="scenarios" className="scenario-article-views" id={this.props.scenario.uuid} /></p>
              <p className="scenario-article-widget-data-likes"><i className="fa fa-thumbs-o-up"></i></p>
              <p className="scenario-article-widget-data-comments"><i className="fa fa-comment-o"></i></p>
            </div>
          </div>
        </header>
        <div className="scenario-article-section">
          <div className="scenario-article-image">
            {thumbnail}
          </div>
          <div className="scenario-article-meta">
            <div className="col-md-4">
              <span className="scenario-ast">actors:</span>
              <span>{this.props.scenario.actors ? this.props.scenario.actors.join(', ') : ''}</span><br></br>
            </div>
            <div className="col-md-4">
              <span className="scenario-ast">sectors:</span>
              <span>{this.props.scenario.sectors ? this.props.scenario.sectors.join(', ') : ''}</span><br></br>
            </div>
            <div className="col-md-4">
              <span className="scenario-ast">tools:</span>
              <span>{this.props.scenario.devices ? this.props.scenario.devices.join(', ') : ''}</span><br></br>
            </div>
          </div>
          <div className="scenario-article-narrative">
            {this.props.scenario.narrative}
          </div>
        </div>
        <footer className="scenario-article-footer">

        </footer>
      </div>
    );
  }
});

export default ScenarioTableView;
