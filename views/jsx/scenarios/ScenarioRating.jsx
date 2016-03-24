import React               from 'react';
import $                   from 'jquery';
import ui                  from '../../../ui_routes.js';
import api                 from '../../../api_routes.js';

import LoadingMixin        from '../LoadingMixin.jsx';
import UserIsLoggedInMixin  from './../UserIsLoggedInMixin.jsx';

var ScenarioRating = React.createClass({
  mixins: [LoadingMixin, UserIsLoggedInMixin],
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
      showThanks: false
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
  getIcons: function(){
    return this.state.icons.map(function(icon, i){
      return <span>
        <img
          className={this.props.className}
          src={ui.asset('static/img/'.concat(this.state.icons[i]))}
          onClick={this.handleClick.bind(this, i)}
          />
      </span>;
    }, this);
  },
  render: function() {
    return (
      <div>
        {this.getIcons()}
        {this.state.enabled && this.state.showThanks ? null : null}
      </div>
    );
  }
});

export default ScenarioRating;
