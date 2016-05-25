import React                from 'react';
import api                  from '../../../api_routes.js';
import $                    from 'jquery';

import ScenarioThumbnails   from './ScenarioThumbnails.jsx';

import I18nMixin            from '../i18n/I18nMixin.jsx';

var BookmarkedScenarios = React.createClass({
  mixins: [I18nMixin],
  getInitialState: function() {
    return {
      scenarios: []
    };
  },
  componentDidMount: function() {

    if(this.props.bundle.length > 0) {

      var options = {
        bundle: this.props.bundle // [""] of uuids
      };

      var url = api.reverse('scenario_list', options);

      $.ajax(url, {
        dataType : 'json',
        success : (scenarios) => {
          this.setState({
            scenarios: scenarios
          });
        }
      });
    }
  },
  render: function() {

    var text = {
      title: this.i18n('Bookmark.title', 'You have not bookmarked any scenarios.'),
      no_bookmarks: this.i18n('Bookmark.no_bookmarks', 'You have not bookmarked any scenarios.')
    };

    return(
      <div>
        {this.state.scenarios.length > 0 ?
          <div>
            <h2 className="pink">
              {text.title}
            </h2>
            <div className="col-lg-12">
              <ScenarioThumbnails
                scenarios={this.state.scenarios}
                limit={15}
                counter={false} />
            </div>
          </div>
          :
          <div>
            <h2 className="pink">
              {text.title}
            </h2>
            <span>
              {text.no_bookmarks}
            </span>
          </div>
        }
      </div>
    );
  }
});

export default BookmarkedScenarios;
