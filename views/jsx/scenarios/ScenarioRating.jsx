import React               from 'react';
import $                   from 'jquery';

var ScenarioRating = React.createClass({
  getInitialState: function() {
    return {
      rating: this.props.rating ? this.props.rating : null,
      icons: ["fa fa-star-o","fa fa-star-o","fa fa-star-o","fa fa-star-o","fa fa-star-o"],
      enabled: this.props.enabled ? this.props.enabled : false
    };
  },
  componentDidMount: function() {
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
  handleClick: function(i) {
    if(this.state.enabled) {
      this.state.icons = this.getInitialState().icons;
      this.setState(this.state);
      var e;
      for(e = 0; e <= i; e++) {
        this.state.icons[e] = "fa fa-star";
      }
      this.setState(this.state);
    }
  },
  getIcons: function(){
    return this.state.icons.map(function(icon, i){
      return <span>
          <i className={this.state.icons[i]}
            onClick={this.handleClick.bind(this, i)}></i>
        </span>;
    }, this);
  },
  render: function() {
    return (
      <div>{this.getIcons()}</div>);
  }
});

export default ScenarioRating;
