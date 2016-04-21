import React  from 'react';
import ScenarioThumbnail  from './ScenarioThumbnail.jsx';
import I18nMixin  from '../i18n/I18nMixin.jsx';

// FIXME: move to less
var sceanriosCounterStyle = {
  textAlign: 'center'
};

var ScenarioThumbnails = React.createClass({
  mixins: [I18nMixin],

  render: function() {

    if (!this.props.scenarios) {
      return null;
    }

    var counter = null;
    if (this.props.counter) {
      counter = (
        <div style={sceanriosCounterStyle}>
          {this.i18n('scenarios', 'Scenarios')}: {this.props.scenarios.length}
        </div>
      );
    }

    return (
      <div>
      {counter}
        <div className="row scenario-thumbnails">
        {
          this.props.scenarios.map(
            (scenario) => <ScenarioThumbnail key={scenario.uuid} scenario={scenario} onChange={this.reload}/>
          )
        }
        </div>
      </div>
    );
  }
});

export default ScenarioThumbnails;
