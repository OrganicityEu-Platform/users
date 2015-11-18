import $            from 'jquery';
import React        from 'react';

import LoadingMixin from './LoadingMixin.jsx';

import api          from '../../api_routes.js';
import Message      from './Message.jsx';
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
  mixins : [LoadingMixin],
  getInitialState: function() {
    return {
      info : undefined,
      width : undefined,
      type : undefined,
      thumbnail : this.props.thumbnail,  // Here, the thumbnail path will be stored
      image : undefined,      // Here, the image path will be stored
    };
  },
  componentDidMount : function() {
    this.validatorTypes = this.props.joi;
  },
  componentWillReceiveProps : function() {
    this.setState({
      thumbnail: this.props.thumbnail
    });
  },
  getValidatorData : function() {
    return {
      height : this.state.height,
      width  : this.state.width,
      type   : this.state.type
    };
  },
  handleChangedFile : function(evt) {

    // Reset state
    this.setState({
      height : undefined,
      width : undefined,

      type : undefined,
      size : undefined,

      file : undefined,
      thumbnail : undefined,
    });

    var reset = (state) => {
      this.props.callback(state);
      this.setState(state);
    };

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
        image.onload = () => {

          this.setState({
            width : image.width,
            height : image.height,
            type : file.type,
            size : file.size
          }, () => {

            this.props.validate((error) => {

              if (!error) {

                //console.log('file OKAY');
                reader.readAsArrayBuffer(file);
                reader.onload = (file_arraybuffer) => {
                  var arrayBuffer = file_arraybuffer.target.result;
                  var blob        = new Blob([arrayBuffer], { type: file.type });

                  // Lets upload a blob
                  var formData = new FormData();
                  formData.append('file', blob);

                  this.loading();
                  $.ajax({
                    url: this.props.url,
                    data: formData,
                    processData: false,
                    contentType: false,
                    type: 'POST',
                    success: (e) => {
                      this.loaded();
                      reset(e);
                    },
                    error : (xhr, textStatus, errorThrown) => {
                      this.loadingError(this.props.url, 'Error while uploading an image')(xhr, textStatus, errorThrown),
                      reset({
                        image : '',
                        thumbnail : ''
                      });
                    }
                  });
                };
              } else {
                reset({
                  image : '',
                  thumbnail : ''
                });
              }
            });

          });

        };
      };
    }
  },
  render: function() {

    var thumbnail;
    var inputFile = (<input
                        type="file"
                        className="oc-input"
                        onChange={this.handleChangedFile}
                        accept="image/jpeg, image/png"/>
                    );

    if (this.isLoading()) {
      thumbnail = (<div>Image upload in progress</div>);
      inputFile = undefined;
    } else if (this.state.thumbnail) {
      thumbnail = (<img src={ui.asset(this.state.thumbnail)} width={this.props.thumbnail_width}/>);
    }

    return (
      <div>
        {inputFile}
        <div className="avatar">{thumbnail}</div>
        <Message type="danger" messages={this.props.getValidationMessages('type')} />
        <Message type="danger" messages={this.props.getValidationMessages('width')} />
        <Message type="danger" messages={this.props.getValidationMessages('height')} />
        <Message type="danger" messages={this.props.getValidationMessages('size')} />
      </div>
    );

  }
});

export default validation(strategy)(UploadImage);
