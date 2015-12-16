import $ from 'jquery';
import FlashQueue from './FlashQueue.jsx';
import React from 'react';


/*
 * The LoadingMixin handles loading state, i.e. when a component triggers an asynchronous reload of
 * data it can call this.loading() to set the components state to loading. Then, in the render
 * function calling this.isLoading() it can check if the state is currently loading, allowing
 * elements to e.g., be disabled during load (like buttons). Once the AJAX call returns the
 * component using the mixin should call this.loaded({ data: data }) where 'data' could be any
 * state field the component uses for whatever it is displaying. The call will then update the
 * state of the component to non-loading and merge in the data passed to the components state.
 *
 * In addition a component using this mixin can call this.loadingError(url, message) which returns
 * an error handler to be used by jQuerys $.ajax call.
 */

var LoadingMixin = {
  getDefaultProps: function() {
    return {
      loadingMessage: 'Loading ...'
    };
  },

  getInitialState: function() {
    return {
      showLoader: false
    };
  },

  loading: function(extendState) {
    if (extendState) {
      var s = $.extend({}, extendState, { loading: true });
      this.setState(s);
    } else {
      this.setState({ loading: true });
    }
  },

  isLoading: function() {
    return this.state && this.state.loading;
  },

  showLoader: function() {
    return this.state && (this.state.showLoader || this.state.loading);
  },

  loadingError: function(url, msg) {
    if (!url) {
      url = '';
    }
    if (!msg) {
      msg = 'Error while loading';
    }
    return (xhr, textStatus, errorThrown) => {
      this.loaded();

      // Append server side error message
      if (xhr && xhr.responseJSON && xhr.responseJSON.error) {
        msg += ': ' + xhr.responseJSON.error;
      }

      FlashQueue.Mixin.flashOnAjaxError(url, msg)(xhr, textStatus, errorThrown);
    };
  },

  loadingSuccess: function(msg, o) {
    this.loaded(o);
    FlashQueue.Mixin.flash('success', msg);
  },

  loaded: function(extendState, callback) {
    if (this.isMounted()) {

      var newState = { loading: false, showLoader: true };

      if (extendState) {
        this.setState($.extend({}, extendState, newState), callback);
      }
      else {
        this.setState(newState, callback);
      }

      window.setTimeout(this.fadeOutLoader, 60);
    }
    else {
      window.setTimeout(() => this.loaded(extendState), 10);
    }
  },

  fadeOutLoader: function() {
    this.setState({ showLoader: false });
  },

  renderLoading: function(innerContent) {

    var loaderClasses = ["loadingFrame",
      this.showLoader() ? 'thisIsNotAClass': 'loaded'].
      join(" ");

    var contentClasses = this.showLoader() ? "loadingContent": "";

    return (
      <div className="withLoader">
        <div className={loaderClasses}>
          <i className="fa fa-cog fa-spin fa-2x"></i>
          <div>
            {this.props.loadingMessage}
          </div>
        </div>
        <div className={contentClasses}>
        {innerContent}
        </div>
      </div>
    );
  }
};

export default LoadingMixin;
