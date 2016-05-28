import React              from 'react';
import ui                 from '../../../ui_routes.js';
import $                  from 'jquery';
import api                from '../../../api_routes.js';

import LoadingMixin       from '../LoadingMixin.jsx';

var ScenarioEco = React.createClass({
  mixins: [LoadingMixin],
  getInitialState: function () {
    return {
      items: [],
      noMatch: [],
      match: ['transport', 'environment', 'cultural', 'retail', 'energy', 'public', 'healthcare', 'agriculture'],
    };
  },
  componentDidMount: function() {

    var options = {
      type : 'scenarios_by_sector',
      match: this.state.match
    };

    var url = api.reverse('statistics', options);

    $.ajax(url, {
      dataType : 'json',
      success : this.handleData
    });
  },
  handleData: function(data) {

    var dataItems = [];

    var i;
    for(i = 0; i < data.length; i++) { dataItems.push(data[i]._id); }

    this.setState({
      noMatch: $(this.state.match).not(dataItems).get(),
      items: data
    });

  },
  render: function() {
    return(
      <div className="oc-eco-items">
        {
          this.state.items.map(
            (item, i) =>
            <div key={i} className={"oc-eco-item"}>
              <img
                className="oc-eco-item-icon"
                src={ui.asset('static/img/'.concat(item._id.concat('_icon.svg')))}/>
              <span className={"oc-eco-item-text" + " " + item._id + "_colour_txt"}>
                {item._id.toUpperCase()}
              </span>
              <span>
                {item.count} scenarios
              </span>
            </div>
          )
        }
        {
          this.state.noMatch.map(
            (item, i) =>
            <div key={i} className={"oc-eco-item"}>
              <img
                className="oc-eco-item-icon"
                src={ui.asset('static/img/'.concat(item.concat('_icon.svg')))}/>
              <span className={"oc-eco-item-text" + " " + item + "_colour_txt"}>
                {item.toUpperCase()}
              </span>
              <span>
                0 scenarios
              </span>
            </div>
          )
        }
      </div>
    );
  }
});

export default ScenarioEco;
