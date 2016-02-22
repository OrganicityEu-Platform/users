import React from 'react';

import ScenarioEvalView from './ScenarioEvalView.jsx';
import ui         from '../../../ui_routes.js';

var Router = require('react-router');

var EvalCom = React.createClass({

  getInitialState: function() {
    return {
      showQ: this.props.showQ ? this.props.showQ : false,
      version: this.props.version,
      uuid: this.props.uuid,
      selectedActor: null,
      questionnaire: null,
      evaluation: {
        scenario: {
          uuid : this.props.uuid,
          version : this.props.version
        },
        submitted: false,
        answers: []
      },
      submitted: false
    };
  },
  clickmehandler: function() {
    this.state.showQ = true;
    this.setState(this.state);
  },
  handleActorSelect: function(actor) {
    console.log('selected ' + actor);
    if (actor === "policy_maker") {
      this.state.selectedActor = "true";
    }else {
      this.state.selectedActor = "false";
    }

    this.setState(this.state);

  },
  handleBack: function () {
    this.state.selectedActor = null;
    this.setState(this.state);

  },
  render: function() {

    if (!this.state.showQ) {
      return (
        <div onClick={this.clickmehandler}><button id="oc-eval-button">EVALUATE THIS SCENARIO</button>
        </div>
      );
    }








    if (this.state.showQ && !this.state.selectedActor) {
      return (
        <div className="row">
          <div onClick={this.clickmehandler}><button id="oc-eval-button">EVALUATE THIS SCENARIO</button>
          </div>
          <div className="oc-macro-content oc-eval-com">
          <div className="oc-eval-actor-description col-sm-12">
            <p>Please select one of the actors below.</p>
            <p>According to the actor you select, a different set of questions will be presented to you. </p>
          </div>

          <div className="oc-eval-actor-tiles-wrapper">
          <div className="col-xs-12 col-sm-3 col-md-2 oc-eval-actor-tile white" onClick={() => this.handleActorSelect('policy_maker')}>
            <img src={ui.asset('static/img/policy_icon.svg')}/>
            <span className="oc-bold">POLICY MAKER</span>
            <p className="oc-eval-actor-tile-description">Lorem ipsum dolor sit amet, orci egestas et molestie gravida praesent, venenatis purus, vitae justo est dignissim mauris, nunc praesent sodales curabitur risus, euismod nibh tellus massa. Libero sed ante vel.</p>
          </div>
          <div className="col-xs-12 col-sm-3 col-md-2 oc-eval-actor-tile white" onClick={() => this.handleActorSelect('business_owner')}>
            <img src={ui.asset('static/img/business_icon.svg')}/>
            <span className="oc-bold">BUSINESS OWNER</span>
            <p className="oc-eval-actor-tile-description">Lorem ipsum dolor sit amet, orci egestas et molestie gravida praesent, venenatis purus, vitae justo est dignissim mauris, nunc praesent sodales curabitur risus, euismod nibh tellus massa. Libero sed ante vel.</p>
          </div>
          <div className="col-xs-12 col-sm-3 col-md-2 oc-eval-actor-tile white" onClick={() => this.handleActorSelect('tourist')}>
            <img src={ui.asset('static/img/tourist_icon.svg')}/>
            <span className="oc-bold">TOURIST</span>
            <p className="oc-eval-actor-tile-description">Lorem ipsum dolor sit amet, orci egestas et molestie gravida praesent, venenatis purus, vitae justo est dignissim mauris, nunc praesent sodales curabitur risus, euismod nibh tellus massa. Libero sed ante vel.</p>
          </div>
          <div className="col-xs-12 col-sm-3 col-md-2 oc-eval-actor-tile white" onClick={() => this.handleActorSelect('researcher')}>
            <img src={ui.asset('static/img/researcher_icon.svg')}/>
            <span className="oc-bold">RESEARCHER</span>
            <p className="oc-eval-actor-tile-description">Lorem ipsum dolor sit amet, orci egestas et molestie gravida praesent, venenatis purus, vitae justo est dignissim mauris, nunc praesent sodales curabitur risus, euismod nibh tellus massa. Libero sed ante vel.</p>
          </div>

        </div>

        </div>
        </div>
      );
    }

    if (this.state.selectedActor) {
      return (
        <div>
          {/*this.state.selectedActor*/}
          <ScenarioEvalView uuid={this.state.uuid} tech={this.state.selectedActor} version={this.state.version}></ScenarioEvalView>
        </div>
      );
    }
  }
});

export default EvalCom;
