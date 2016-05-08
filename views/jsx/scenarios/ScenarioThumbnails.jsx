import React  from 'react';
import ScenarioThumbnail  from './ScenarioThumbnail.jsx';
import I18nMixin  from '../i18n/I18nMixin.jsx';

// FIXME: move to less
var sceanriosCounterStyle = {
  textAlign: 'center'
};

var ScenarioThumbnails = React.createClass({
  mixins: [I18nMixin],
  getInitialState: function() {
    return {
      limit: this.props.limit ? this.props.limit : null,
    };
  },
  handleLoadMore: function() {
    var increment = (this.state.limit + this.state.limit) > this.props.scenarios.length ?
    this.props.scenarios.length - this.state.limit : this.state.limit;

    this.setState({limit: this.state.limit + increment});
  },
  render: function() {

    var loadMore = this.state.limit ?
    this.props.scenarios.length > this.state.limit ?
    <button onClick={() => this.handleLoadMore()}>
      load more
    </button>
    :
    null:
    null;

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
            this.state.limit ?
            this.props.scenarios.map(
              (scenario, i) => {  return i <= this.state.limit ?
                <ScenarioThumbnail
                  key={scenario.uuid}
                  scenario={scenario}
                  onChange={this.reload}/>
                :
                null}
              )
              :
              this.props.scenarios.map(
                (scenario) =>
                <ScenarioThumbnail
                  key={scenario.uuid}
                  scenario={scenario}
                  onChange={this.reload}/>
              )
            }
          </div>
          {loadMore}
        </div>
      );
    }
  });

  export default ScenarioThumbnails;
