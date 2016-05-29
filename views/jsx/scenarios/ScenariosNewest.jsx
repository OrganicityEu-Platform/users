import $                  from 'jquery';
import React              from 'react';
import api                from '../../../api_routes.js';
import ScenarioThumbnails from '../scenarios/ScenarioThumbnails.jsx';

import LoadingMixin       from '../LoadingMixin.jsx';
import I18nMixin          from '../i18n/I18nMixin.jsx';

var ScenariosNewest = React.createClass({
  mixins: [LoadingMixin, I18nMixin],
  getInitialState: function() {
    return {
      loading: true,
      user: null,
      scnearios: []
    };
  },
  componentDidMount: function() {
    this.loading();

    var options = {
      creator : this.props.creator,
      sortBy : 'timestamp',
      sortDir : 'DESC',
      limit : this.props.limit,

    };

    var url = api.reverse('scenario_list', options);
    console.log(url);
    $.ajax(url, {
      dataType : 'json',
      error : this.loadingError(url, 'Error loading newest scenarios'),
      success : (scenarios) => {
        this.loaded({
          scenarios: scenarios
        });
      }
    });
  },
  render: function() {

    var text = {
      none_authored: this.i18n('none_authored', 'You have not published any scenarios yet.')
    };

    if (this.isLoading()) {
      return this.renderLoading();
    }

    return (
      <div>
        {this.props.title ?
          <h2 className="oc-pink">{this.props.title}</h2>
          : null}
          {this.props.creator ? this.state.scenarios.length === 0 ?
            <span>
              {text.none_authored}
            </span>
            : null : null }
            <div className="col-lg-12">
              <ScenarioThumbnails
                scenarios={this.state.scenarios}
                counter={this.props.counter} />
            </div>

          </div>
        );
      }
    });

    export default ScenariosNewest;
