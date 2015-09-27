
import UserAvatar from '../users/UserAvatar.jsx';
import TimeAgo    from 'react-timeago';
import api        from '../../../api_routes.js';
import ui         from '../../../ui_routes.js';
import React      from 'react';

var Router = require('react-router');
var Link = Router.Link;

var ScenarioThumbnail = React.createClass({

  mixins: [Router.Navigation],

  clickHandler: function() {
    this.transitionTo('scenarioView', { uuid: this.props.scenario.uuid });
  },

  render: function() {
    return (
      <div className="col-md-4">
        <div
          className="well scenario-thumbnail"
          onClick={this.clickHandler}>
          <header className="scenario-thumbnail-header">
            <span>
              <span className="scenario-thumbnail-timestamp">
                { this.props.scenario.timestamp ?
                  <TimeAgo date={this.props.scenario.timestamp} />
                  : '' }
              </span>
            </span>
              <h3 className="scenario-thumbnail-title">
                {this.props.scenario.title}
              </h3>
            </header>
            <p className="scenario-thumbnail-summary">
              { this.props.scenario.summary ? this.props.scenario.summary.replace(/(?:\r\n|\r|\n)/g,/(?:\r\n|\r|\n)/g,/(?:\r\n|\r|\n)/g,/(?:\r\n|\r|\n)/g,/(?:\r\n|\r|\n)/g,/(?:\r\n|\r|\n)/g,/(?:\r\n|\r|\n)/g,/(?:\r\n|\r|\n)/g, '<br>') : '' }
            </p>
            <img src="" alt=""/>
          </div>
        </div>
      );
    }
  });

  export default ScenarioThumbnail;
