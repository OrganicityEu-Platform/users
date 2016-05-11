import React  from 'react';
import ScenarioThumbnail  from './ScenarioThumbnail.jsx';
import I18nMixin  from '../i18n/I18nMixin.jsx';


import PackeryMixin from 'react-packery-mixin';

// FIXME: move to less
var sceanriosCounterStyle = {
  textAlign: 'center'
};

// http://packery.metafizzy.co/options.html
var packeryOptions = {
  transitionDuration: '0.4s',
  itemSelector: '.scenario-thumbnail'
};

var ScenarioThumbnails = React.createClass({
  mixins: [I18nMixin, PackeryMixin("oc-scenario-thumbnails-pack", packeryOptions)],
  getInitialState: function() {
    return {
      limit: this.props.limit ? this.props.limit : null,
      increment: 15
    };
  },
  handleLoadMore: function() {
    this.setState({limit: this.state.limit + this.state.increment});
  },
  renderThumbnails: function() {
    var e;
    for(e = 0; e <= this.props.scenarios; e++){
      return(
        <ScenarioThumbnail
          key={scenarios[e].scenario.uuid}
          scenario={scenarios[e]}
          onChange={this.reload}/>
      );
    }
  },
  render: function() {

    var loadMore = this.state.limit ?
    this.props.scenarios.length > this.state.limit ?
    <button className="oc-button" onClick={() => this.handleLoadMore()}>
      LOAD MORE
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
      <div className="row">
        <div
          ref="oc-scenario-thumbnails-pack"
          className="oc-scenario-thumbnails-pack">
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
          <div id="oc-explore-load-more-btn">{loadMore}</div>
        </div>
      );
    }
  });

  export default ScenarioThumbnails;
