import $                 from 'jquery';
import React             from 'react';
import FlashQueue        from '../FlashQueue.jsx';
import TagField          from '../form-components/TagField.jsx';
import api               from '../../../api_routes.js';
import ui                from '../../../ui_routes.js';
import Router            from 'react-router';
import ScenarioTableView from './ScenarioTableView.jsx';

// Input validation
import validation        from 'react-validation-mixin';
import strategy          from 'joi-validation-strategy';
import ScenarioJoi       from '../../../models/joi/scenario.js';
import Message      from '../Message.jsx';

// Mixins
import UserIsLoggedInMixin from '../UserIsLoggedInMixin.jsx';
import UploadImage         from '../UploadImage.jsx';


var ScenarioEditView = React.createClass({
  mixins : [Router.Navigation, Router.State, FlashQueue.Mixin, UserIsLoggedInMixin],
  firstStep : 1,
  getSteps: function() {
    return [this.form, this.preview];
  },
  editMode: function() {
    return this.props.params.uuid;
  },
  routeName: function() {
    var routeName = this.getRoutes()[this.getRoutes().length - 1].name;
    return routeName;
  },
  componentWillMount : function() {
    if (!this.props.query.step) {
      this.props.query.step = '' + this.firstStep;
    }
  },
  getInitialState: function() {

    // if we're in the process of editing a scenario the browser session storage will remember
    // values until users persisted it on the server
    if (window.sessionStorage && window.sessionStorage.getItem(this.storageKey()) != null) {
      var o = JSON.parse(window.sessionStorage.getItem(this.storageKey()));
      o.creator = window.currentUser.uuid;
      o.btnClickedOnce = false;
      return o;
    }
    // if we're not in the editing process already and not editing, creating a new one
    return {
      title : '',
      summary : '',
      narrative : '',
      sectors : [],
      actors : [],
      devices : [],
      step : 1,
      creator : window.currentUser ? window.currentUser.uuid : undefined,
      image_width : undefined,
      image_type : undefined,
      thumbnail : undefined,  // Here, the path will be stored
      image : undefined,      // Here, the path will be stored
      credit : undefined,
      copyright : undefined,
      btnClickedOnce : false
    };
  },
  componentDidMount() {

    if (!this.userIsLoggedIn()) {
      var src = {
        to : this.routeName(),
        params : this.getParams(),
        query : this.props.query
      };
      sessionStorage.setItem('url', JSON.stringify(src));
      this.transitionTo('login');
      return;
    }

    if (this.editMode()) {

      var url = api.reverse('scenario_by_uuid', { uuid : this.props.params.uuid });
      $.getJSON(url, (scenario) => {
        if (this.isMounted()) {
          this.setState(scenario);
        }
      });
    }
  },
  storageKey : function() {
    this.editMode() ? 'ocScenarioEdit' : 'ocScenarioCreate';
  },
  clearState : function() {
    window.sessionStorage.removeItem(this.storageKey());
  },
  saveState : function() {
    window.sessionStorage.setItem(this.storageKey(), JSON.stringify(this.state));
  },
  currentStep : function() {
    return parseInt(this.props.query.step);
  },
  handleChangedTitle : function(evt) {
    this.setState({title: evt.target.value}, () => {
      if (this.state.btnClickedOnce) {
        console.log('this', this);
        this.props.validate();
      }
    });
  },
  handleChangedSummary : function(evt) {
    this.setState({summary: evt.target.value}, () => {
      if (this.state.btnClickedOnce) {
        this.props.validate();
      }
    });
  },
  handleChangedNarrative : function(evt) {
    this.setState({narrative: evt.target.value}, () => {
      if (this.state.btnClickedOnce) {
        this.props.validate();
      }
    });
  },
  handleChangedSectors : function(sectors) {
    this.setState({sectors: sectors}, () => {
      if (this.state.btnClickedOnce) {
        this.props.validate();
      }
    });
  },
  handleChangedActors : function(actors) {
    this.setState({actors: actors}, () => {
      if (this.state.btnClickedOnce) {
        this.props.validate();
      }
    });
  },
  handleChangedDevices : function(devices) {
    this.setState({devices: devices}, () => {
      if (this.state.btnClickedOnce) {
        this.props.validate();
      }
    });
  },
  handleChangedCredit : function(evt) {
    if (evt.target.value === '') {
      this.setState({credit: undefined});
    } else {
      this.setState({credit: evt.target.value}, () => {
        if (this.state.btnClickedOnce) {
          this.props.validate();
        }
      });
    }
  },
  handleChangedCopyright : function(evt) {
    if (evt.target.value === '') {
      this.setState({copyright: undefined});
    } else {
      this.setState({copyright: evt.target.value}, () => {
        if (this.state.btnClickedOnce) {
          this.props.validate();
        }
      });
    }
  },
  onThumbnail : function(data) {
    this.setState(data);
  },
  clickedPrevious : function() {

    this.setState({
      btnClickedOnce: false
    });

    if (this.currentStep() - 1 < this.firstStep) {
      console.log('User tried to go beyond first step. This is not possible!');
      return;
    }
    this.saveState();
    this.transitionTo(this.routeName(), { uuid : this.props.params.uuid }, { step : this.currentStep() - 1 });
  },
  clickedPreview : function() {

    this.setState({
      btnClickedOnce: true
    });

    if (this.currentStep() + 1 > this.getSteps().length) {
      console.log('User tried to go beyond last step. This is not possible!');
      return;
    }

    this.saveState();

    this.validatorTypes = ScenarioJoi.edit;
    this.getValidatorData = function() {
      return {
        title     : this.state.title,
        summary   : this.state.summary,
        narrative : this.state.narrative,
        sectors   : this.state.sectors,
        actors    : this.state.actors,
        devices   : this.state.devices,
        thumbnail : this.state.thumbnail,
        image     : this.state.image,
        credit    : this.state.credit,
        copyright : this.state.copyright
      };
    };

    this.validateCurrentStep(() => {
      this.transitionTo(this.routeName(), { uuid : this.props.params.uuid }, { step : this.currentStep() + 1 });
    });

  },
  clickedSubmit : function() {

    this.validatorTypes = ScenarioJoi.preview;
    this.getValidatorData = function() {
      return {
        title     : this.state.title,
        summary   : this.state.summary,
        narrative : this.state.narrative,
        sectors   : this.state.sectors,
        actors    : this.state.actors,
        devices   : this.state.devices,
        thumbnail : this.state.thumbnail,
        image     : this.state.image,
        credit    : this.state.credit,
        copyright : this.state.copyright
      };
    };

    this.validateCurrentStep(() => {
      var method = this.editMode() ? 'PUT' : 'POST';
      var url    = this.editMode() ? api.reverse('scenario_by_uuid', { uuid : this.props.params.uuid })
        : api.reverse('scenario_list');

      $.ajax(url, {
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(this.getValidatorData()),
        method: method,
        error: this.flashOnAjaxError(api.reverse('scenario_list'), 'Error while submitting scenario'),
        success: (scenario) => {
          this.clearState();
          this.transitionTo('scenarioView', { uuid : scenario.uuid });
        }
      }
      );
    });

  },
  validateCurrentStep : function(onvalidate, onerror) {

    if (this.validatorTypes) {

      this.props.validate((error) => {
        if (error) {
          //console.log('Input validation error!', error);
          if (onerror) {
            onerror();
          }
          this.setState({}); // Rerender to show errors
        } else {
          //console.log('Input validation successful!');
          if (onvalidate) {
            onvalidate();
          }
        }
      });

    } else {
      if (callback) {
        callback();
      }
    }
  },
  form : function() {

    return (
      <div className="container oc-create-edit-view">
        <div className="row">
          <div className="scenario-create-edit-view-title-wrapper">
            <h1>{this.editMode() ? 'Edit your scenario' : 'Create your scenario'}</h1>
          </div>
          <form className="form-horizontal">
            <div className="form-group oc-create-edit oc-create-edit-title">
              <label className="control-label col-sm-2" htmlFor="title">Title <i className={this.state.title ? 'scenario-article-check-icon fa fa-check' : 'scenario-article-check-icon fa fa-exclamation-circle'}></i></label>
              <div className="col-sm-10">
                <input type="text" className="form-control" name="title" id="title" value={this.state.title}
                  onChange={this.handleChangedTitle} />
                <Message type="danger" messages={this.props.getValidationMessages('title')} />
              </div>
            </div>
            <div className="form-group oc-create-edit oc-create-edit-summary">
              <label className="control-label col-sm-2" htmlFor="summary">Summary <i className={this.state.summary ? 'scenario-article-check-icon fa fa-check' : 'scenario-article-check-icon fa fa-exclamation-circle'}></i></label>
              <div className="col-sm-10">
                <textarea type="text" className="form-control" name="summary" id="summary" value={this.state.summary}
                  onChange={this.handleChangedSummary} />
                <Message type="danger" messages={this.props.getValidationMessages('summary')} />
              </div>
            </div>
            <div className="form-group oc-create-edit oc-create-edit-narrative">
              <label className="control-label col-sm-2" htmlFor="narrative">Narrative <i className={this.state.narrative ? 'scenario-article-check-icon fa fa-check' : 'scenario-article-check-icon fa fa-exclamation-circle'}></i></label>
              <div className="col-sm-10">
                <textarea className="form-control" name="narrative" id="narrative" value={this.state.narrative}
                  onChange={this.handleChangedNarrative} />
                <Message type="danger" messages={this.props.getValidationMessages('narrative')} />
              </div>
            </div>
            <div className="form-group oc-create-edit oc-create-edit-sectors">
              <label className="control-label col-sm-2" htmlFor="sectors">Sectors</label>
              <div className="col-sm-10">
                <TagField tags={this.state.sectors} onChange={this.handleChangedSectors} />
              </div>
            </div>
            <div className="form-group oc-create-edit oc-create-edit-actors">
              <label className="control-label col-sm-2" htmlFor="sectors">Actors</label>
              <div className="col-sm-10">
                <TagField tags={this.state.actors} onChange={this.handleChangedActors} />
              </div>
            </div>
            <div className="form-group oc-create-edit oc-create-edit-tools">
              <label className="control-label col-sm-2" htmlFor="sectors">Tools</label>
              <div className="col-sm-10">
                <TagField tags={this.state.devices} onChange={this.handleChangedDevices} />
              </div>
            </div>
            <div className="form-group oc-create-edit oc-create-edit-image">
              <div className="col-sm-2"></div>
              <div className="col-sm-10">
                Please upload an image. File type must be JPEG pr PNG with a width of at least width 1140 px<br/>
              </div>
              <label className="control-label col-sm-2" htmlFor="title">Cover Image</label>
              <div className="col-sm-10">
                  <UploadImage
                    url={api.reverse('upload_thumbnail')}
                    joi={ScenarioJoi.image}
                    callback={this.onThumbnail}
                    thumbnail={this.state.thumbnail}
                    thumbnail_width="200px"
                  />
              </div>
            </div>
            <div className="form-group oc-create-edit oc-create-edit-image-copyright">
              <label className="control-label col-sm-2" htmlFor="sectors">Image copyright</label>
              <div className="col-sm-10">
                <input type="text" className="form-control" name="credit" id="credit" value={this.state.copyright}
                  onChange={this.handleChangedCopyright} />
              </div>
            </div>
            <div className="form-group oc-create-edit oc-create-edit-image-credit">
              <label className="control-label col-sm-2" htmlFor="sectors">Credit</label>
              <div className="col-sm-10">
                <input type="text" className="form-control" name="credit" id="credit" value={this.state.credit}
                  onChange={this.handleChangedCredit} />
              </div>
            </div>
            <div className="form-group">

              <div className="col-md-2 col-md-offset-5">
                <button
                  type="button"
                  className="oc-button-submit"
                  onClick={this.clickedPreview}
                  disabled={this.loading ? 'disabled' : ''}
                >Preview</button>
              </div>

            </div>
          </form>
        </div>
      </div>
    );
  },
  preview : function() {

    return (
      <div className="row" key="scenarioEditStep5">
        <h2>Create your scenario <small>preview</small></h2>
        <h3>Here's your story!</h3>
        <p>
          Donec id elit non mi porta gravida at eget metus. Donec ullamcorper nulla non metus auctor
          fringilla.
        </p>
        <ScenarioTableView scenario={this.state} />
        <Message type="danger" messages={this.props.getValidationMessages()} />
        <p>
          <button type="button" className="btn btn-default" onClick={this.clickedPrevious}>Edit</button>
          <button type="button" className="btn btn-default" onClick={this.clickedSubmit}>Submit</button>
        </p>
      </div>
    );
  },
  render: function() {
    //console.log('Render state: ', this.state);
    var steps = this.getSteps();
    return steps[this.currentStep() - 1]();
  },
  getValidatorData: undefined,
  validatorTypes: undefined
});

export default validation(strategy)(ScenarioEditView);
