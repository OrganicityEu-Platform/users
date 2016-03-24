import $                  from 'jquery';
import React              from 'react';
import startsWithPolyfill from 'string.prototype.startswith';
import LoadingMixin       from '../LoadingMixin.jsx';
import api                from '../../../api_routes.js';
import ui                 from '../../../ui_routes.js';

import ScenarioThumbnail  from '../scenarios/ScenarioThumbnail.jsx';
import Counter            from '../Counter.jsx';
import ScenariosNewest    from '../scenarios/ScenariosNewest.jsx';
import Message            from '../Message.jsx';

var Router = require('react-router');
var Link = Router.Link;

import config             from '../../../config/config.js';
import DocumentTitle      from 'react-document-title';

var bio = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sed sapien rutrum erat sagittis ultricies a eu arcu. Pellentesque ut sem vel nunc eleifend dapibus eu eget nunc. Quisque ac mattis elit. Nunc tristique aliquet rutrum. Vestibulum ultrices eros tellus, vitae bibendum nibh pulvinar a. Integer rutrum faucibus est, a dignissim tellus pulvinar vitae. Integer elementum dictum mi non ultricies.';

var UserAvatar = React.createClass({
  mixins: [LoadingMixin],
  getInitialState: function() {
    return {
      loading: true,
      user: null
    };
  },
  componentDidMount: function() {
    this.loading();
    var url = api.reverse('user_info', { uuid : this.props.params.uuid });

    $.ajax(url, {
      dataType : 'json',
      error : (jqXHR, textStatus, errorThrown) => {
        this.setState({error: jqXHR});
        this.loaded();
      },
      success : (user) => {
        this.state.user = user;
        this.loaded(this.state);
      }
    });
  },
  render: function() {

    if (this.state.loading) {
      return this.renderLoading();
    }

    if (this.state.error) {
      var message = (this.state.error.status + ': ' + this.state.error.statusText);
      return (<Message message={message} type="danger"/>);
    }

    var userText = this.props.params.uuid;
    if (!this.state.user) {
      userText = 'Deleted user';
    } else if (this.state.user.name && this.state.user.name !== '') {
      userText = this.state.user.name;
    }

    var image = this.state.user.image;
    if (image && image.startsWith('uploads/')) {
      image = ui.asset(this.state.user.image);
    }

    // Set default image, if no url is given
    if (!image) {
      image = 'https://www.gravatar.com/avatar/?d=mm' ;
    }

    var facebook;
    if(this.state.user.facebook) {
      var url = 'https://facebook.com/' + this.state.user.facebook;
      facebook = (
        <div className="oc-userview-social">
          <a href={url} target="_blank">
            <span className="fa fa-facebook fa-lg fa-fw"></span>
          </a>
        </div>
      )
    }

    var twitter;
    if(this.state.user.twitter) {
      var url = 'https://twitter.com/' + this.state.user.twitter;
      twitter = (
        <div className="oc-userview-social">
          <a href={url} target="_blank">
            @{this.state.user.twitter} <span className="fa fa-twitter fa-lg fa-fw"></span>
          </a>
        </div>
      )
    }

    var google;
    if(this.state.user.google) {
      var url = 'https://plus.google.com/' + this.state.user.google;
      google = (
        <div className="oc-userview-social">
          <a href={url} target="_blank">
            <span className="fa fa-google-plus fa-lg fa-fw"></span>
          </a>
        </div>
      )
    }

    var github;
    if(this.state.user.github) {
      var url = 'https://github.com/' + this.state.user.github;
      github = (
        <div className="oc-userview-social">
          <a href={url} target="_blank">
            {this.state.user.github} <span className="fa fa-github fa-lg fa-fw"></span>
          </a>
        </div>
      )
    }

    var location;
    if (this.state.user.location) {
      location = (
        <div className="oc-userview-social">
          <span className="fa-lg fa-fw fa-map-marker"></span> {this.state.user.location}
        </div>
      );
    }


    var twitter;
    if(this.state.user.twitter) {
      var url = 'https://twitter.com/' + this.state.user.twitter;
      twitter = (
        <div className="oc-userview-social">
          <a href={url} target="_blank">
            @{this.state.user.twitter} <span className="fa fa-twitter fa-lg fa-fw"></span>
          </a>
        </div>
      )
    }

    var publicWebsite;
    if(this.state.user.publicWebsite) {
      var url = this.state.user.publicWebsite;
      publicWebsite = (
        <div className="oc-userview-social">
          <a href={url} target="_blank">
            {this.state.user.publicWebsite} <span className="fa fa-home fa-lg fa-fw"></span>
          </a>
        </div>
      )
    }

    var publicEmail;
    if(this.state.user.publicEmail) {
      var url = 'mailto:' + this.state.user.publicEmail;
      publicEmail = (
        <div className="oc-userview-social">
          <a href={url} target="_blank">
            {this.state.user.publicEmail} <span className="fa fa-envelope fa-lg fa-fw"></span>
          </a>
        </div>
      )
    }

    var profession;
    if(this.state.user.profession && this.state.user.profession.length > 0) {
      profession = (
        <div>
          {this.state.user.profession.join(' / ')}
        </div>
      )
    }

    var professionTitle;
    if(this.state.user.professionTitle) {
      professionTitle = (
        <div>
          {this.state.user.professionTitle}
        </div>
      )
    }

    return (
      <div>
        <div className="container">
          <div className="row oc-userview">
            <div className="col-sm-8">
              <h1 className="oc-userview-title">{this.state.user.name}</h1>
              {location}
              {profession}
              {professionTitle}
            </div>
            <div className="col-sm-4 oc-userview-right">
              {publicEmail}
              {publicWebsite}
              {twitter}
              {github}
              {facebook}
              {google}
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12 oc-userview-center">
              <h3>Scenarios created</h3>
              <ScenariosNewest creator={this.props.params.uuid} counter={false} />
            </div>
          </div>

        </div>
      </div>
    );

/*
          <div className="row">
            <div className="col-sm-6 oc-userview-center">
              <h3>Scenarios created</h3>
              <ScenariosNewest creator={this.props.params.uuid} counter={false} />
            </div>
            <div className="col-sm-6 oc-userview-center">
              <h3>Scenarios rated</h3>
              <ScenariosNewest creator={this.props.params.uuid} counter={false} />
            </div>
          </div>


*/

    /*
    return (
      <div className="row">
        <DocumentTitle title={config.title + ' | User | ' + userText} />
        <div className="col-lg-8 col-lg-offset-2">
          <div className="user-view-profile-wrapper row">
            <div className="user-view-profile-image-wrapper col-md-3">
              <img className="img-circle" src={image} width="210" height="210"/>
            </div>
            <div className="col-md-9">
              <div className="row">
                <div className="col-md-6">
                  <h2 onClick={this.clickHandle}>{userText}</h2>
                  Profile views: <Counter scope="users" id={this.props.params.uuid} />
                </div>
                <div className="user-view-profile-roles col-md-6">roles go here</div>
              </div>
              <div className="row">
                <div className="col-md-8">{bio}</div>
                <div className="col-md-4">meta</div>
              </div>
            </div>
          </div>
          <div className="user-view-thumbnails-wrapper">
          </div>
        </div>
      </div>
    );
    */
  }
});

export default UserAvatar;
