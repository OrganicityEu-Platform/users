import $                  from 'jquery';
import React              from 'react';
import LoadingMixin       from '../LoadingMixin.jsx';
import api                from '../../../api_routes.js';
import ui                 from '../../../ui_routes.js';

import ScenarioThumbnail  from '../scenarios/ScenarioThumbnail.jsx';
import Counter            from '../Counter.jsx';
import ScenariosNewest    from '../scenarios/ScenariosNewest.jsx';
import Message            from '../Message.jsx';

var Router = require('react-router');
var Link = Router.Link;

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
      return <div>Loading...</div>;
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

    return (
      <div className="row">
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
            <h3>Published scenarios</h3>
            <ScenariosNewest creator={this.props.params.uuid} counter={true} />
          </div>
        </div>
      </div>
    );
  }
});

export default UserAvatar;
