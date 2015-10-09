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
import ErrorMessage      from '../ErrorMessage.jsx';
import UserIsLoggedInMixin from '../UserIsLoggedInMixin.jsx';

var ScenarioEditView = React.createClass({
  mixins : [Router.Navigation, Router.State, FlashQueue.Mixin, UserIsLoggedInMixin],
  firstStep : 1,
  getSteps: function() {
    return [this.step1, this.step2, this.step3, this.step4, this.step5, this.step6];
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
      return JSON.parse(window.sessionStorage.getItem(this.storageKey()));
    }

    // if we're not in the editing process already and not editing, creating a new one
    return {
      title : '',
      summary : '',
      narrative : '',
      sectors : [],
      actors : [],
      devices : [],
      step : 1
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
    this.state.title = evt.target.value;
    this.setState(this.state);
  },
  handleChangedSummary : function(evt) {
    this.state.summary = evt.target.value;
    this.setState(this.state);
  },
  handleChangedNarrative : function(evt) {
    this.state.narrative = evt.target.value;
    this.setState(this.state);
  },
  handleChangedSectors : function(sectors) {
    this.state.sectors = sectors;
    this.setState(this.state);
  },
  handleChangedActors : function(actors) {
    this.state.actors = actors;
    this.setState(this.state);
  },
  handleChangedDevices : function(devices) {
    this.state.devices = devices;
    this.setState(this.state);
  },
  handleChangedFile : function(evt) {

    var that = this;
    //this.state.title = evt.target.value;
    var files = evt.target.files; // FileList object
    if (files.length > 0) {
      var file = files[0];

      that.state.thumbnail_type = file.type;

      if (file.type !== 'image/jpeg') {
        return;
      }

      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (file2) => {

        var b64File = file2.target.result;
        that.state.thumbnail = b64File;

        // Needed to get the width and height
        var image  = new Image();
        image.src    = b64File;
        image.onload = function() {
          that.state.thumbnail_width = this.width;
          that.state.thumbnail_height = this.height;
          that.setState(that.state);
        };

      };

    }
  },
  clickedPrevious : function() {
    if (this.currentStep() - 1 < this.firstStep) {
      console.log('User tried to go beyond first step. This is not possible!');
      return;
    }
    this.saveState();
    this.transitionTo(this.routeName(), { uuid : this.props.params.uuid }, { step : this.currentStep() - 1 });
  },
  clickedNext : function() {

    if (this.currentStep() + 1 > this.getSteps().length) {
      console.log('User tried to go beyond last step. This is not possible!');
      return;
    }

    this.saveState();
    this.validateCurrentStep(() => {
      this.transitionTo(this.routeName(), { uuid : this.props.params.uuid }, { step : this.currentStep() + 1 });
    });

  },
  clickedSubmit : function() {

    var that = this;

    this.validateCurrentStep(() => {
      var method = this.editMode() ? 'PUT' : 'POST';
      var url    = this.editMode() ? api.reverse('scenario_by_uuid', { uuid : this.props.params.uuid })
        : api.reverse('scenario_list');

      $.ajax(url, {
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(this.getUploadData()),
        method: method,
        error: this.flashOnAjaxError(api.reverse('scenario_list'), 'Error while submitting scenario'),
        success: (scenario) => {

          // Upload IMAGE from b64
          // https://gist.github.com/borismus/1032746
          var BASE64_MARKER = ';base64,';
          function convertDataURIToBinary(dataURI) {
            var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
            var base64 = dataURI.substring(base64Index);
            var raw = window.atob(base64);
            var rawLength = raw.length;
            var array = new Uint8Array(new ArrayBuffer(rawLength));

            var i;
            for (i = 0; i < rawLength; i++) {
              array[i] = raw.charCodeAt(i);
            }
            return array;
          }

          // Get uint8Array version of the stored base64
          var uint8Array = convertDataURIToBinary(this.state.thumbnail);
          var arrayBuffer = uint8Array.buffer;
          var blob        = new Blob([arrayBuffer], { type: this.state.thumbnail_type });

          // Lets upload a blob
          var formData = new FormData();
          formData.append('thumbnail', blob);

          var url = api.reverse('scenario_by_uuid', { uuid : scenario.uuid }) + '/thumbnail';

          $.ajax({
            url: url,
            data: formData,
            processData: false,
            contentType: false,
            type: 'POST',
            success: () => {
              this.clearState();
              this.transitionTo('scenarioView', { uuid : scenario.uuid });
            }
          });
        }
      }
      );
    });

  },
  validateCurrentStep : function(callback) {

    if (this.validatorTypes) {

      this.props.validate((error) => {
        if (error) {
          //console.log('Input validation error!', error);
          this.setState(this.state); // Rerender to show errors
        } else {
          //console.log('Input validation successful!');
          callback();
        }
      });

    } else {
      callback();
    }
  },
  step1 : function() {
    this.validatorTypes = ScenarioJoi.step1;
    return (
      <div>
        <div className="row" key="scenarioEditStep1">
          <h2>Create your scenario <small>step one</small></h2>
          <h3>Write your short story!</h3>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Aenean eu leo
            quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Integer posuere
            erat a ante venenatis dapibus posuere velit aliquet.
          </p>
        </div>
        <div className="row well">
          <form className="form-horizontal">
            <div className="form-group">
              <label className="control-label col-sm-2" htmlFor="title">Title</label>
              <div className="col-sm-10">
                <input type="text" className="form-control" name="title" id="title" value={this.state.title}
                  onChange={this.handleChangedTitle} />
                <ErrorMessage messages={this.props.getValidationMessages('title')} />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-sm-2" htmlFor="summary">Summary</label>
              <div className="col-sm-10">
                <input type="text" className="form-control" name="summary" id="summary" value={this.state.summary}
                  onChange={this.handleChangedSummary} />
                <ErrorMessage messages={this.props.getValidationMessages('summary')} />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-sm-2" htmlFor="narrative">Narrative</label>
              <div className="col-sm-10">
                <textarea className="form-control" name="narrative" id="narrative" value={this.state.narrative}
                  onChange={this.handleChangedNarrative} />
                <ErrorMessage messages={this.props.getValidationMessages('narrative')} />
              </div>
            </div>
            <div className="form-group">
              <div className="col-sm-2"></div>
              <div className="col-sm-10">
                <button type="button" className="btn btn-default" onClick={this.clickedNext}>Next</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  },
  step2 : function() {
    return (
      <div>
        <div className="row" key="scenarioEditStep2">
          <h2>Create your scenario <small>step two</small></h2>
          <h3>Select the Sector(s)!</h3>
          <p>
            Donec sed odio dui. Maecenas sed diam eget risus varius blandit sit amet non magna.
          </p>
        </div>
        <div className="row well">
          <form className="form-horizontal">
            <div className="form-group">
              <label className="control-label col-sm-2" htmlFor="sectors">Sectors</label>
              <div className="col-sm-10">
                <TagField tags={this.state.sectors} onChange={this.handleChangedSectors} />
              </div>
            </div>
            <div className="form-group">
              <div className="col-sm-2"></div>
              <div className="col-sm-10">
                <button type="button" className="btn btn-default" onClick={this.clickedPrevious}>Previous</button>
                <button type="button" className="btn btn-default" onClick={this.clickedNext}>Next</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  },
  step3 : function() {
    return (
      <div>
        <div className="row" key="scenarioEditStep3">
          <h2>Create your scenario <small>step three</small></h2>
          <h3>Select the Actor(s)!</h3>
          <p>
            Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum
            massa justo sit amet risus. Sed posuere consectetur est at lobortis. Morbi leo risus,
            porta ac consectetur ac, vestibulum at eros. Cras justo odio, dapibus ac facilisis in,
            egestas eget quam.
          </p>
          <div className="row well">
            <form className="form-horizontal">
              <div className="form-group">
                <label className="control-label col-sm-2" htmlFor="sectors">Actors</label>
                <div className="col-sm-10">
                  <TagField tags={this.state.actors} onChange={this.handleChangedActors} />
                </div>
              </div>
              <div className="form-group">
                <div className="col-sm-2"></div>
                <div className="col-sm-10">
                  <button type="button" className="btn btn-default" onClick={this.clickedPrevious}>Previous</button>
                  <button type="button" className="btn btn-default" onClick={this.clickedNext}>Next</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  },
  step4 : function() {
    return (
      <div>
        <div className="row" key="scenarioEditStep4">
          <h2>Create your scenario <small>step four</small></h2>
          <h3>Select the Tools(s)!</h3>
          <p>
            Curabitur blandit tempus porttitor. Praesent commodo cursus magna, vel scelerisque nisl
            consectetur et. Donec sed odio dui.
          </p>
          <div className="row well">
            <form className="form-horizontal">
              <div className="form-group">
                <label className="control-label col-sm-2" htmlFor="sectors">Tools</label>
                <div className="col-sm-10">
                  <TagField tags={this.state.devices} onChange={this.handleChangedDevices} />
                </div>
              </div>
              <div className="form-group">
                <div className="col-sm-2"></div>
                <div className="col-sm-10">
                  <button type="button" className="btn btn-default" onClick={this.clickedPrevious}>Previous</button>
                  <button type="button" className="btn btn-default" onClick={this.clickedNext}>Next</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  },
  step5 : function() {

    this.validatorTypes = ScenarioJoi.step5;

    return (
      <div>
        <div className="row well">
          <form className="form-horizontal">
            <div className="form-group">
              <div className="col-sm-12">
                Please upload an image. Width must be 1140 px and height can vary between 600 px and 800 px<br/>
              </div>
              <label className="control-label col-sm-2" htmlFor="title">Thumbnail</label>
              <div className="col-sm-10">
                <input type="file" className="form-control" name="thumbnail" id="thumbnail"
                  onChange={this.handleChangedFile} />
                <div id="uploadPreview"></div>
                <ErrorMessage messages={this.props.getValidationMessages('thumbnail')} />
                <ErrorMessage messages={this.props.getValidationMessages('thumbnail_type')} />
                <ErrorMessage messages={this.props.getValidationMessages('thumbnail_width')} />
                <ErrorMessage messages={this.props.getValidationMessages('thumbnail_height')} />
              </div>
              <div className="form-group">
                <div className="col-sm-2"></div>
                <div className="col-sm-10">
                  <button type="button" className="btn btn-default" onClick={this.clickedPrevious}>Previous</button>
                  <button type="button" className="btn btn-default" onClick={this.clickedNext}>Next</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  },
  step6 : function() {
    this.validatorTypes = ScenarioJoi.step6;

    console.log('State', this.state);

    return (
      <div className="row" key="scenarioEditStep5">
        <h2>Create your scenario <small>step five</small></h2>
        <h3>Here's your story!</h3>
        <p>
          Donec id elit non mi porta gravida at eget metus. Donec ullamcorper nulla non metus auctor
          fringilla.
        </p>
        <ScenarioTableView scenario={this.state} />
        <ErrorMessage messages={this.props.getValidationMessages()} />
        <p>
          <button type="button" className="btn btn-default" onClick={this.clickedPrevious}>Previous</button>
          <button type="button" className="btn btn-default" onClick={this.clickedSubmit}>Submit</button>
        </p>
      </div>
    );
  },
  render: function() {
    //console.log('Render state: ', this.state);
    this.validatorTypes = null;
    var steps = this.getSteps();
    return steps[this.currentStep() - 1]();
  },
  getValidatorData: function() {
    var data = {
      title     : this.state.title,
      summary   : this.state.summary,
      narrative : this.state.narrative,
      sectors   : this.state.sectors,
      actors    : this.state.actors,
      devices   : this.state.devices,
      thumbnail : this.state.thumbnail,
      thumbnail_width : this.state.thumbnail_width,
      thumbnail_height : this.state.thumbnail_height,
      thumbnail_type : this.state.thumbnail_type
    };
    return data;
  },
  getUploadData: function() {
    var data = {
      title     : this.state.title,
      summary   : this.state.summary,
      narrative : this.state.narrative,
      sectors   : this.state.sectors,
      actors    : this.state.actors,
      devices   : this.state.devices
    };
    return data;
  },
  validatorTypes: undefined
});

export default validation(strategy)(ScenarioEditView);
