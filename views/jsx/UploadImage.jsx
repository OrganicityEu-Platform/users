import $            from 'jquery';
import React        from 'react';
import FlashQueue   from './FlashQueue.jsx';
import api          from '../../api_routes.js';
import ErrorMessage from './ErrorMessage.jsx';
import ui           from '../../ui_routes.js';

import validation   from 'react-validation-mixin';
import strategy     from 'joi-validation-strategy';

/*
 * Params:
 * url: an REST enpoint to upload the image. It should return
 * {
 *   image: ...
 *   thumbnail: ...
 * }
 * joi: a joi scheme to validate the image
 * callback: will be called with the retuned data from the rest endpoint
 * thumbnail: default thumbnail
 *
 * Example:
 *
 * <UploadImage url={...} joi={...} callback={...}/>
 */
var UploadImage = React.createClass({
  mixins : [FlashQueue.Mixin],
  getInitialState: function() {
    return {
      info : undefined,
      width : undefined,
      type : undefined,
      thumbnail : this.props.thumbnail,  // Here, the path will be stored
      image : undefined,      // Here, the path will be stored
    };
  },
  componentDidMount : function() {
    this.validatorTypes = this.props.joi;
  },
  getValidatorData : function() {
    return {
      height : this.state.height,
      width  : this.state.width,
      type   : this.state.type
    };
  },
  handleChangedFile : function(evt) {

    console.log('FOO');

    // Reset state
    this.setState({
      height : undefined,
      width : undefined,

      type : undefined,
      size : undefined,

      file : undefined,
      thumbnail : undefined,

      status : 'Image upload in progress',
      loading : true
    });

    var that = this;
    //this.state.title = evt.target.value;
    var files = evt.target.files; // FileList object
    if (files.length > 0) {
      var file = files[0];

      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (file_base64) => {
        var b64File = file_base64.target.result;

        // Needed to get the width and height
        var image  = new Image();
        image.src    = b64File;
        image.onload = function() {
          that.setState({
            width : this.width,
            height : this.height,
            type : file.type,
            size : file.size
          });

          var reset = (state) => {
            that.props.callback(state);
            state.status = undefined;
            state.loading = false;
            that.setState(state);
          };

          that.props.validate((error) => {
            if (!error) {
              //console.log('file OKAY');
              reader.readAsArrayBuffer(file);
              reader.onload = (file_arraybuffer) => {
                var arrayBuffer = file_arraybuffer.target.result;
                var blob        = new Blob([arrayBuffer], { type: file.type });

                // Lets upload a blob
                var formData = new FormData();
                formData.append('file', blob);

                $.ajax({
                  url: that.props.url,
                  data: formData,
                  processData: false,
                  contentType: false,
                  type: 'POST',
                  success: reset,
                  error : () => {
                    that.flashOnAjaxError(that.props.url, 'Error while uploading an image'),
                    reset({});
                  }
                });
              };
            } else {
              reset({});
            }
          });
        };
      };
    }
  },
  render: function() {

    var thumbnail;
    var inputFile = (<input
                        type="file"
                        className="form-control"
                        onChange={this.handleChangedFile}
                        accept="image/jpeg, image/png"/>
                    );

    if (this.state.status) {
      thumbnail = (<div>{this.state.status}</div>);
      inputFile = undefined;
    } else if (this.state.thumbnail) {
      thumbnail = (<img src={ui.asset(this.state.thumbnail)} width={this.props.thumbnail_width}/>);
    }

    return (
      <div>
        {inputFile}
        <div>{thumbnail}</div>
        <ErrorMessage messages={this.props.getValidationMessages('type')} />
        <ErrorMessage messages={this.props.getValidationMessages('width')} />
        <ErrorMessage messages={this.props.getValidationMessages('height')} />
        <ErrorMessage messages={this.props.getValidationMessages('size')} />
      </div>
    );

  }
});

export default validation(strategy)(UploadImage);
