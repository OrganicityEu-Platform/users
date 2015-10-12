import $                  from 'jquery';
import React              from 'react';
import FlashQueue         from '../FlashQueue.jsx';
import LoadingMixin       from '../LoadingMixin.jsx';
import api                from '../../../api_routes.js';
import ScenarioThumbnail  from '../scenarios/ScenarioThumbnail.jsx';

var Router = require('react-router');
var Link = Router.Link;

var UserAvatar = React.createClass({
  mixins: [FlashQueue.Mixin, LoadingMixin],
  getInitialState: function() {
    return {
      loading: true,
      user: null
    };
  },
  componentDidMount: function() {
    console.log('this.proups', this.props.params);
    this.loading();
    var url = api.reverse('user_info', { uuid : this.props.params.uuid });

    var getScenarios = () => {

      url = 'http://localhost:8080/organicity-scenario-tool/api/v1/scenarios?creator=' + this.props.params.uuid + '&sortBy=timestamp&sortDir=DESC';

      $.ajax(url, {
        dataType : 'json',
        error : (jqXHR, textStatus, errorThrown) => {
          this.loaded();
          this.flashOnAjaxError(url, 'Error loading user info')(jqXHR, textStatus, errorThrown);
        },
        success : (scenarios) => {
          this.state.scenarios = scenarios;
          this.setState(this.state);
          this.loaded();
        }
      });
    };

    $.ajax(url, {
      dataType : 'json',
      error : (jqXHR, textStatus, errorThrown) => {
        getScenarios();
        this.state.user = {
          name : 'Unknown or deleted user'
        };
        this.setState(this.state);
      },
      success : (user) => {
        getScenarios();
        this.state.user = user;
        this.setState(this.state);
      }
    });
  },
  render: function() {
    if (this.state.loading) {
      return <div>Loading...</div>;
    }

    var userText = this.props.params.uuid;
    if (!this.state.user) {
      userText = 'Deleted user';
    } else if (this.state.user.name) {
      userText = this.state.user.name;
    }

    return (<div className="row">
              <div className="col-md-12">
                <h2>{userText}</h2>
                <h3>Scenarios created by {userText}</h3>
                <div className="row scenario-thumbnails">
                {
                  this.state.scenarios.map((scenario) => <ScenarioThumbnail key={scenario.uuid} scenario={scenario}
                    onChange={this.reload}/>)
                }
                </div>
              </div>
            </div>
          );
  }
});

export default UserAvatar;
