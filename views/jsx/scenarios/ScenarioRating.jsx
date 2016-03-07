import React               from 'react';
import $                   from 'jquery';
import api                 from '../../../api_routes.js';
import LoadingMixin        from '../LoadingMixin.jsx';

var ScenarioRating = React.createClass({
  mixins: [LoadingMixin],
  getInitialState: function() {
    return {
      rating: null,
      icons: ["fa fa-star-o","fa fa-star-o","fa fa-star-o","fa fa-star-o","fa fa-star-o"],
      enabled: this.props.enabled ? this.props.enabled : false,
      scenario: this.props.scenario ? this.props.scenario : null,
      ajax: this.props.ajax ? this.props.ajax : false
    };
  },
  componentDidMount: function() {
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
        this.state.icons[e] = "fa fa-star";
      }
      this.setState(this.state);
      var rating = i + 1;
      var url = api.reverse('ratings_list');
      var rated = {
        user: this.state.scenario.creator,
        rating: rating,
        scenario: {
          uuid: this.state.scenario.uuid,
          version: this.state.scenario.version
        }
      };
      $.ajax(url, {
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(rated),
        method: 'POST',
        success: this.setState({enabled: false})
      });
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
    if(this.state.rating) {
      var floor = Math.floor(this.state.rating);
      var frac = this.state.rating % 1;
      if(floor >= 1) {
        var e;
        for(e = 0; e < floor; e++) {
          this.state.icons[e] = "fa fa-star";
        }
        if(frac >= 0.5) {
          this.state.icons[floor] = "fa fa-star-half-full";
        }
      }
      this.setState(this.state);
    }
  },
  getIcons: function(){

    return this.state.icons.map(function(icon, i){
      return <span>
        <i
          className={this.state.icons[i]}
          onClick={this.handleClick.bind(this, i)}>
        </i>
      </span>;
    }, this);
  },
  render: function() {
    return (
      <div>
        {this.getIcons()}
      </div>
    );
  }
});

export default ScenarioRating;
