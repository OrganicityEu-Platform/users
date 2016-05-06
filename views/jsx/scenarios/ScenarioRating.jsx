import React               from 'react';
import $                   from 'jquery';
import ui                  from '../../../ui_routes.js';
import api                 from '../../../api_routes.js';

import LoadingMixin        from '../LoadingMixin.jsx';
import UserIsLoggedInMixin  from './../UserIsLoggedInMixin.jsx';
import I18nMixin            from '../i18n/I18nMixin.jsx';

var Router = require('react-router');

var ScenarioRating = React.createClass({
  mixins: [LoadingMixin, UserIsLoggedInMixin, Router.Navigation, I18nMixin],
  getInitialState: function() {
    return {
      rating: null,
      doMeta: this.props.doMeta ? this.props.doMeta : false,
      icons:
      ["emptystaricon.png","emptystaricon.png","emptystaricon.png","emptystaricon.png","emptystaricon.png"],
      metaIcons:
      ["emptystaricon_meta.png","emptystaricon_meta.png","emptystaricon_meta.png","emptystaricon_meta.png","emptystaricon_meta.png"],
      enabled: this.props.enabled ? this.props.enabled : false,
      scenario: this.props.scenario ? this.props.scenario : null,
      userRating: [],
      hover: false,
      showThanks: false,
      doSimple: this.props.doSimple ? this.props.doSimple : false,
    };
  },
  componentWillMount: function() {
    if(this.state.doMeta) {
      this.setState({icons: this.state.metaIcons});
    }
  },
  setUserRating: function(rating) {
    this.setState({userRating: rating});
    this.setRating();
  },
  componentDidMount: function() {

    if(this.userIsLoggedIn() && this.state.enabled) {
      var url = api.reverse('ratings_list', {
        user_uuid: currentUser.uuid,
        scenario_uuid: this.state.scenario.uuid});
      $.ajax(url, {
        dataType : 'json',
        success: this.setUserRating
      });
    }
    if(!this.state.enabled) {
      this.getRating();
    }
  },
  handleClick: function(i) {
    if(this.state.enabled) {
      if(!this.userIsLoggedIn()) {
        sessionStorage.setItem('prevScenario', this.state.scenario.uuid);
        sessionStorage.setItem('prevScenarioScore', i + 1);
        this.transitionTo('login');
        return;
      }
      this.state.icons = this.getInitialState().icons;
      this.setState(this.state);
      var e;
      for(e = 0; e <= i; e++) {
        this.state.icons[e] = "fullstaricon.png";
      }
      this.setState(this.state);
      var rating = i + 1;
      var url = api.reverse('ratings_list');
      var rated = {
        user: currentUser.uuid,
        rating: rating,
        scenario: {
          uuid: this.state.scenario.uuid,
          version: this.state.scenario.version
        }
      };

      if(this.state.userRating.length === 0) {
        $.ajax(url, {
          dataType: 'json',
          contentType: 'application/json',
          data: JSON.stringify(rated),
          method: 'POST',
          success: this.setState({showThanks: true})
        });
      }
      if(this.state.userRating.length === 1) {
        $.ajax(url, {
          dataType: 'json',
          contentType: 'application/json',
          data: JSON.stringify(rated),
          method: 'PATCH',
          success: this.setState({showThanks: true})
        });
      }
    }
  },
  getRating: function() {
    var url = api.reverse('ratings_by_scenario', { uuid : this.state.scenario.uuid });
    $.ajax(url, {
      dataType : 'json',
      success : (rating) => {
        this.state.rating = rating.average;
        this.setState(this.state);
        this.setRating();
      }
    });
  },
  setRating: function() {
    if(this.state.userRating.length === 1) {
      var e;
      for(e = 0; e < this.state.userRating[0].rating; e++ ) {
        this.state.icons[e] = "fullstaricon.png";
      }
      this.setState(this.state);
    }
    if(this.state.rating) {
      var floor = Math.floor(this.state.rating);
      var frac = this.state.rating % 1;
      if(floor >= 1) {
        var i;
        for(i = 0; i < floor; i++) {
          if(this.state.doMeta) {
            this.state.icons[i] = "fullstaricon_meta.png";
          }else{
            this.state.icons[i] = "fullstaricon.png";
          }
        }
        if(frac >= 0.5) {
          if(this.state.doMeta) {
            this.state.icons[floor] = "halfstaricon_meta.png";
          }else {
            this.state.icons[floor] = "halfstaricon.png";
          }
        }
      }
      this.setState(this.state);
    }
  },
  doHover: function() {
    if(!this.state.doMeta) {
      this.setState({
        hover: true
      });
    }
  },
  getIcons: function(){
    return this.state.icons.map(function(icon, i){
      if(this.state.doSimple) {
        return <span>
          <img
            className={this.props.className}
            src={ui.asset('static/img/'.concat(this.state.icons[i]))}
            onClick={this.handleClick.bind(this, i)}
            />
        </span>;
      }
      if(this.state.doMeta) {
        return <span>
          <img
            className={this.props.className}
            src={ui.asset('static/img/'.concat(this.state.icons[i]))}
            />
        </span>;
      }
      if(this.state.hover) {
        return <span>
          <img
            className={this.props.className}
            src={ui.asset('static/img/'.concat(this.state.icons[i]))}
            onClick={this.handleClick.bind(this, i)}
            />
        </span>;
      } else if(i < 1 ) {
        return <span>
          <img
            className={this.props.className}
            src={ui.asset('static/img/'.concat(this.state.icons[0]))}
            />
        </span>;
      }
    }, this);
  },
  noHover: function() {
    this.setState({hover: false});
  },
  render: function() {

    if(this.state.doSimple) {
      return (
        <div>
          {this.getIcons()}
        </div>
      );
    }

    return (
      <div className="oc-ratings-wrapper">
        {this.state.doMeta ?
          this.getIcons() :
          <span
            className="gray"
            onMouseLeave={this.noHover}
            onMouseOver={this.doHover}>
            {this.getIcons()}
            {this.i18n('rate_scenario', 'Rate scenario')}
          </span>}
      </div>
    );
  }
});

export default ScenarioRating;
