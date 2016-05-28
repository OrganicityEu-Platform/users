import React              from 'react';
import ui                 from '../../../ui_routes.js';
import $                  from 'jquery';
import api                from '../../../api_routes.js';

import LoadingMixin       from '../LoadingMixin.jsx';

var ScenarioEco = React.createClass({
  mixins: [LoadingMixin],
  getInitialState: function () {
    return {
      items: []
    };
  },
  componentDidMount: function() {

    var options = {
      type : 'scenarios_by_sector',
      match: ['transport', 'environment', 'cultural', 'retail', 'energy', 'public', 'healthcare']
    };

    var url = api.reverse('statistics', options);
    console.log(url);
    $.ajax(url, {
      dataType : 'json',
      success : (result) => {
        this.setState({
          items: result
        });
      }
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
      </div>
    );
  }
});

export default ScenarioEco;
