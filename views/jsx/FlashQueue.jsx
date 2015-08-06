// based on https://github.com/aackerman/react-flash-queue/
import $ from 'jquery';
import React from 'react';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';

// used for singleton pattern
var mountedInstance;

var Queue = React.createClass({
  getInitialState: function() {
    return {
      id : 0,
      messages: []
    }
  },
  componentDidMount: function() {
    mountedInstance = this;
  },
  dismissMessage: function(id) {
    this.state.messages = this.state.messages.filter((message) => message.id != id);
    this.setState(this.state);
  },
  flash: function(type, text, opts) {
    var id = ++this.state.id;
    this.state.messages.push({
      type: type,
      text: text,
      id: id,
      dismissable: true
    });
    this.setState(this.state);
    setTimeout(() => this.dismissMessage(id), 15 * 1e3);
  },
  render: function() {
    return (
      <div className="flash-queue">
        <ReactCSSTransitionGroup transitionName="flashfade">
        {this.state.messages.map((message, i) => {
          return <Message
            key={message.id}
            text={message.text}
            type={message.type}
            dismissMessage={() => this.dismissMessage(message.id)}
          />;
        })}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
});

var Message = React.createClass({
  render: function() {
    var classes = ['alert', 'flash-message', 'alert-'+this.props.type];
    return (
      <div className={classes.join(" ")}>
        {this.props.text}
        <i className="flash-delete" onClick={() => this.props.dismissMessage(this.props.key)}>&times;</i>
      </div>
    );
  }
});

var Mixin = {
  flash: function(type, text, opts) {
    if (type != '' && type != 'success' && type != 'info' && type != 'warning' && type != 'danger'){
      console.log('Wrong flash type "'+type+'". Use one of ["", "info", "success", "warning", "danger"].)');
    }
    mountedInstance.flash(type,text,opts);
  },
  flashOnAjaxError: function(url, message) {
    return function(jqXHR, textStatus, errorThrown) {
      var content = <div>
        <b>Error doing AJAX request to {url}:</b> {message}<br/>
        <b>jqXHR</b><br/>
        <pre>{jqXHR}</pre>
        <b>textStatus</b><br/>
        <pre>{textStatus}</pre>
        <b>errorThrown</b>
        <pre>{errorThrown}</pre>
      </div>
      mountedInstance.flash('danger', content);
    }
  }
}

export default {
  Mixin : Mixin,
  Queue : Queue
}
