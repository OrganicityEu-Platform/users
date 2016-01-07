import $                    from 'jquery';
import React                from 'react';
import TagField             from '../form-components/TagField.jsx';
import api                  from '../../../api_routes.js';
import ui                   from '../../../ui_routes.js';
import Router               from 'react-router';
import ValidationIndicator  from '../ValidationIndicator.jsx'
import ScenarioTableView    from './ScenarioTableView.jsx';
import SectorSelector       from '../SectorSelector.jsx';

import { Button, ButtonToolbar, OverlayTrigger, Popover } from 'react-bootstrap';

import LoadingMixin         from '../LoadingMixin.jsx';

// Input validation
import validation           from 'react-validation-mixin';
import strategy             from 'joi-validation-strategy';
import ScenarioJoi          from '../../../models/joi/scenario.js';
import ScenarioConfig       from '../../../config/scenario.js';
import Message              from '../Message.jsx';

// Mixins
import UserIsLoggedInMixin  from '../UserIsLoggedInMixin.jsx';
import UploadImage          from '../UploadImage.jsx';

import lang                 from '../../../lang/en.js'

var ScenarioEditView = React.createClass({
  mixins : [Router.Navigation, Router.State, LoadingMixin, UserIsLoggedInMixin],
  predefinedSectors: [
    'public', 'transport', 'agriculture',
    'energy', 'retail', 'healthcare',
    'cultural', 'environment'
  ],
  sectorIcons: [
    'fa fa-users public_colour oc-tag-icon',
    'fa fa-bus transport_colour oc-tag-icon',
    'fa fa-leaf agriculture_colour oc-tag-icon',
    'fa fa-lightbulb-o energy_colour oc-tag-icon',
    'fa fa-tags retail_colour oc-tag-icon',
    'fa fa-medkit healthcare_colour oc-tag-icon',
    'fa fa-university cultural_colour oc-tag-icon',
    'fa fa-tree environment_colour oc-tag-icon',
  ],
  firstStep : 1,
  getSteps: function() {
    return [this.form, this.preview];
  },
  editMode: function() {
    return this.props.params.uuid;
  },
  routeName: function() {
    return this.getRoutes()[this.getRoutes().length - 1].name;
  },
  componentWillMount : function() {
    if (!this.props.query.step) {
      this.props.query.step = '' + this.firstStep;
    }
    if (this.currentStep() === 1) {
      this.prepareValidationPreview();
    }
  },
  getInitialState: function() {

    /*
    // if we're in the process of editing a scenario the browser session storage will remember
    // values until users persisted it on the server
    if (window.sessionStorage && window.sessionStorage.getItem(this.storageKey()) != null) {
      var o = JSON.parse(window.sessionStorage.getItem(this.storageKey()));
      o.creator = window.currentUser.uuid;
      o.btnClickedOnce = false;
      return o;
    }
    */

    // if we're not in the editing process already and not editing, creating a new one
    return {
      title : '',
      summary : '',
      narrative : '',
      newSectors : [],
      selectedSectors : [],
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
      btnClickedOnce : false,
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
      $.ajax(url, {
        dataType : 'json',
        error : this.loadingError(url, 'Error loading newest scenarios'),
        success : (scenario) => {
          for (var i = 0; i < scenario.sectors.length; i++) {
            var s = scenario.sectors[i].toLowerCase();
            if (this.predefinedSectors.indexOf(s) >= 0) {
              this.state.selectedSectors.push(s);
            } else {
              this.state.newSectors.push(s);
            }
          }

          this.setState(scenario, () => {
            this.props.validate();
          });
        }
      });

    } else {
      // Generate intial validation
      setTimeout(() => {
        this.props.validate();
      }, 10);
    }
  },
  storageKey : function() {
    this.editMode() ? 'ocScenarioEdit' : 'ocScenarioCreate';
  },
  /*
  clearState : function() {
    window.sessionStorage.removeItem(this.storageKey());
  },
  saveState : function() {
    window.sessionStorage.setItem(this.storageKey(), JSON.stringify(this.state));
  },
  */
  currentStep : function() {
    return parseInt(this.props.query.step);
  },
  handleChangedTitle : function(evt) {
    this.setState({title: evt.target.value}, () => {
      if (this.state.btnClickedOnce) {
        this.props.validate();
      } else {
        this.props.validate('title');
      }
    });
  },
  handleChangedSummary : function(evt) {
    this.setState({summary: evt.target.value}, () => {
      if (this.state.btnClickedOnce) {
        this.props.validate();
      } else {
        this.props.validate('summary');
      }
    });
  },
  handleChangedNarrative : function(evt) {
    this.setState({narrative: evt.target.value}, () => {
      if (this.state.btnClickedOnce) {
        this.props.validate();
      } else {
        this.props.validate('narrative');
      }
    });
  },
  handleNewSector: function(newSectors) {
    var sectors = [];
    Array.prototype.push.apply(sectors, this.state.selectedSectors);
    Array.prototype.push.apply(sectors, newSectors);

    this.setState({sectors: sectors, newSectors: newSectors}, () => {
      if (this.state.btnClickedOnce) {
        this.props.validate();
      } else {
        this.props.validate('selectedSectors');
      }
    });
  },
  handleSectorSelector: function(selectedSectors) {
    var sectors = [];
    Array.prototype.push.apply(sectors, selectedSectors);
    Array.prototype.push.apply(sectors, this.state.newSectors);

    console.log('selectedSectors', selectedSectors);

    this.setState({selectedSectors: selectedSectors, sectors: sectors}, () => {
      if (this.state.btnClickedOnce) {
        this.props.validate();
      }else {
        this.props.validate('selectedSectors');
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

    // Trim, as soon the button is clicked
    this.setState({
      btnClickedOnce: false
    });

    if (this.currentStep() - 1 < this.firstStep) {
      console.log('User tried to go beyond first step. This is not possible!');
      return;
    }
    //this.saveState();
    this.transitionTo(this.routeName(), { uuid : this.props.params.uuid }, { step : this.currentStep() - 1 });
  },
  clickedPreview : function() {

    // Trim, as soon the button is clicked
    this.setState({
      btnClickedOnce: true,
      title     : this.state.title.trim(),
      summary   : this.state.summary.trim(),
      narrative : this.state.narrative.trim(),
      credit    : this.state.credit ? this.state.credit.trim() : this.state.credit,
      copyright : this.state.copyright ? this.state.copyright.trim() : this.state.copyright
    });

    if (this.currentStep() + 1 > this.getSteps().length) {
      console.log('User tried to go beyond last step. This is not possible!');
      return;
    }

    this.prepareValidationPreview();
    //this.saveState();

    this.validateCurrentStep(() => {
      this.transitionTo(this.routeName(), { uuid : this.props.params.uuid }, { step : this.currentStep() + 1 });
    });

  },
  prepareValidationPreview : function() {
    this.validatorTypes = ScenarioJoi.preview;
    this.getValidatorData = function() {
      return {
        title           : this.state.title.trim(),
        summary         : this.state.summary.trim(),
        narrative       : this.state.narrative.trim(),
        selectedSectors : this.state.selectedSectors,
        actors          : this.state.actors,
        devices         : this.state.devices,
        thumbnail       : this.state.thumbnail,
        image           : this.state.image,
        credit          : this.state.credit ? this.state.credit.trim() : this.state.credit,
        copyright       : this.state.copyright ? this.state.copyright.trim() : this.state.copyright
      };
    };
    //this.props.validate();
  },
  clickedSubmit : function() {

    this.validatorTypes = ScenarioJoi.submit;
    this.getValidatorData = function() {
      return {
        title     : this.state.title.trim(),
        summary   : this.state.summary.trim(),
        narrative : this.state.narrative.trim(),
        sectors   : this.state.sectors,
        actors    : this.state.actors,
        devices   : this.state.devices,
        thumbnail : this.state.thumbnail,
        image     : this.state.image,
        credit    : this.state.credit ? this.state.credit.trim() : this.state.credit,
        copyright : this.state.copyright ? this.state.copyright.trim() : this.state.copyright
      };
    };

    this.validateCurrentStep(() => {
      var method = this.editMode() ? 'PUT' : 'POST';
      var url    = this.editMode() ? api.reverse('scenario_by_uuid', { uuid : this.props.params.uuid })
        : api.reverse('scenario_list');
      var successMessage = this.editMode() ? 'Sceanrios updated successfully.' : 'Sceanrio created successfully';
      var errorMessage = this.editMode() ? 'Error while updating a scenario.' : 'Error while creating a scenario';

      this.loading();
      $.ajax(url, {
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(this.getValidatorData()),
        method: method,
        error: this.loadingError(url, errorMessage),
        success: (scenario) => {
          //this.clearState();
          this.loadingSuccess(successMessage);
          this.transitionTo('scenarioView', { uuid : scenario.uuid });
        }
      });
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

    // return (<SectorEdit onChange={this.handleChangedSectors} sectors={this.state.sectors}/>);

    //console.log('state', this.state);
    //console.log('title', this.props.isValid('title'));
    //console.log('summary', this.props.isValid('summary'));
    //console.log('narrative', this.props.isValid('narrative'));

    var errorMessageTitle = null;
    var errorMessageSummary = null;
    var errorMessageNarrative = null;
    var errorMessageSelectedSectors = null;

    // Just show the error messages, if the button was clicked once
    if (this.state.btnClickedOnce) {
      errorMessageTitle = (<Message type="danger" messages={this.props.getValidationMessages('title')} />);
      errorMessageSummary = (<Message type="danger" messages={this.props.getValidationMessages('summary')} />);
      errorMessageNarrative = (<Message type="danger" messages={this.props.getValidationMessages('narrative')} />);
      errorMessageSelectedSectors = (<Message type="danger" messages={this.props.getValidationMessages('selectedSectors')} />);
    }

    return (
      <div className="row oc-form-group-view">
        <div className="oc-macro-content">
          <h1 className="oc-white">{this.editMode() ? 'Edit your scenario' : 'Create your scenario'}</h1>
          <form className="form-horizontal">
            <div className="form-group oc-form-group">
              <label className="control-label col-sm-3" htmlFor="title">Title <ValidationIndicator valid={this.props.isValid('title')}/>
                <span className="oc-form-group-info">
                  {lang.ScenarioEditView.titleInfo}
                </span>
              </label>
              <div className="col-sm-9">
                <input maxLength={ScenarioConfig.max.title} type="text" className="oc-input" name="title" id="title" value={this.state.title}
                  onChange={this.handleChangedTitle} />
                <span className="oc-char-remain">{ScenarioConfig.max.title - this.state.title.length} characters remaining</span>
                {errorMessageTitle}
              </div>
            </div>
            <div className="form-group oc-form-group">
              <label className="control-label col-sm-3" htmlFor="summary">Summary <ValidationIndicator valid={this.props.isValid('summary')}/>
                <span className="oc-form-group-info">
                  {lang.ScenarioEditView.summaryInfo}
                </span>
              </label>
              <div className="col-sm-9">
                <textarea maxLength={ScenarioConfig.max.summary} type="text" className="oc-input scenario-create-edit-summary" name="summary" id="summary" value={this.state.summary}
                  onChange={this.handleChangedSummary} />
                <span className="oc-char-remain">{ScenarioConfig.max.summary - this.state.summary.length} characters remaining</span>
                {errorMessageSummary}
              </div>
            </div>
            <div className="form-group oc-form-group">
              <label className="control-label col-sm-3" htmlFor="narrative">Narrative <ValidationIndicator valid={this.props.isValid('narrative')}/>
                <span className="oc-form-group-info">
                  {lang.ScenarioEditView.narrativeInfo}
                </span>
              </label>
              <div className="col-sm-9">
                <textarea maxLength={ScenarioConfig.max.narrative} className="oc-input scenario-create-edit-narrative" name="narrative" id="narrative" value={this.state.narrative}
                  onChange={this.handleChangedNarrative} />
                <span className="oc-char-remain">{ScenarioConfig.max.narrative - this.state.narrative.length} characters remaining</span>
                {errorMessageNarrative}
              </div>
            </div>
            <div className="form-group oc-form-group">
              <label className="control-label col-sm-3" htmlFor="sectors">Sectors <ValidationIndicator valid={this.props.isValid('selectedSectors')}/>
                <span className="oc-form-group-info">
                  {lang.ScenarioEditView.sectorsInfo}</span>
              </label>
              <div className="col-sm-9">
                <SectorSelector
                  onChange={this.handleSectorSelector}
                  sectors={this.predefinedSectors}
                  sectorIcons={this.sectorIcons}
                  selected={this.state.selectedSectors}
                />
                {errorMessageSelectedSectors}
                <div className="new-sector-suggest">
                  Suggest new sectors:
                  <TagField
                    id="createEditSearchFormSectors"
                    placeholder="Add sector tags"
                    tags={this.state.newSectors}
                    onChange={this.handleNewSector}
                     />
                </div>
              </div>
            </div>
            <div className="form-group oc-form-group">
              <label className="control-label col-sm-3" htmlFor="sectors">Actors
                <span className="oc-form-group-info">
                  {lang.ScenarioEditView.actorsInfo}</span>
              </label>
              <div className="col-sm-9">
                <TagField
                  id="createEditSearchFormActors"
                  placeholder="Add actor tags"
                  tags={this.state.actors}
                  onChange={this.handleChangedActors}
                  />
              </div>
            </div>

            <div className="form-group oc-form-group">
              <label className="control-label col-sm-3" htmlFor="sectors">Tools
                <span className="oc-form-group-info">
                  {lang.ScenarioEditView.toolsInfo}
                </span>
              </label>
              <div className="col-sm-9">
                <TagField
                  id="createEditSearchFormDevices"
                  placeholder="Add tool tags"
                  tags={this.state.devices}
                  onChange={this.handleChangedDevices} />
              </div>
            </div>

            <div className="form-group oc-form-group">
              <label className="control-label col-sm-3">Image
                <span className="oc-form-group-info">
                  {lang.ScenarioEditView.imageuploadInfo}
                </span>
              </label>
              <div className="col-sm-9">
                <UploadImage
                  url={api.reverse('upload_thumbnail')}
                  joi={ScenarioJoi.image}
                  callback={this.onThumbnail}
                  thumbnail={this.state.thumbnail}
                  thumbnail_width="200px"
                />
              </div>
            </div>

            <div className="form-group oc-form-group">
              <label className="control-label col-sm-3" htmlFor="copyright">Image copyright
                <span className="oc-form-group-info">
                  {lang.ScenarioEditView.imageCopyrightInfo}
                </span>
              </label>
              <div className="col-sm-9">
                <input type="text" className="oc-input" name="copyright" id="copyright" value={this.state.copyright}
                  onChange={this.handleChangedCopyright} />
              </div>
            </div>

            <div className="form-group oc-form-group">
              <label className="control-label col-sm-3" htmlFor="sectors">Credit
                <span className="oc-form-group-info">
                  {lang.ScenarioEditView.creditInfo}
                </span>
              </label>
              <div className="col-sm-9">
                <input type="text" className="oc-input" name="credit" id="credit" value={this.state.credit}
                  onChange={this.handleChangedCredit} />
              </div>
            </div>

            <div className="form-group">
              <div className="oc-create-edit-preview-btn-wrapper">
                <button
                  type="button"
                  className="oc-button"
                  onClick={this.clickedPreview}
                >Preview</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  },
  preview : function() {

    var btnText = this.editMode() ? 'Submit updated scenario' : 'Submit new scenario';

    return (
      <div>
        <div className="container">
          <div className="col-md-12">
            <h1 className="oc-white">{this.editMode() ? 'Edit your scenario' : 'Create your scenario'} <small className="white">preview</small></h1>
            <h2 className="oc-white">Here's your story!</h2>
            <p className="white">
              Please review your scenario. If everything is fine, please submit it.
            </p>
          </div>
        </div>
        <ScenarioTableView scenario={this.state} />
        <Message type="danger" messages={this.props.getValidationMessages()} />
        <div className="row">
          <div className="form-group">
            <div className="col-sm-3 col-sm-offset-3">
              <button type="button" className="oc-button" onClick={this.clickedPrevious}>Edit</button>
            </div>
            <div className="col-sm-3">
              <button type="button" className="oc-button" onClick={this.clickedSubmit}>{btnText}</button>
            </div>
          </div>
        </div>
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
