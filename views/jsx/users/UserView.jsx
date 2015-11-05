import $                  from 'jquery';
import React              from 'react';
import FlashQueue         from '../FlashQueue.jsx';
import LoadingMixin       from '../LoadingMixin.jsx';
import api                from '../../../api_routes.js';
import ui                 from '../../../ui_routes.js';

import ScenarioThumbnail  from '../scenarios/ScenarioThumbnail.jsx';
import Counter            from '../Counter.jsx';
import ScenariosNewest    from '../scenarios/ScenariosNewest.jsx';
import ErrorMessage       from '../ErrorMessage.jsx';

var Router = require('react-router');
var Link = Router.Link;

var UserAvatar = React.createClass({
  mixins: [FlashQueue.Mixin, LoadingMixin],
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
        this.setState(this.state);
      }
    });
  },
  render: function() {

    if (this.state.loading) {
      return <div>Loading...</div>;
    }

    if (this.state.error) {
      var message = (this.state.error.status + ': ' + this.state.error.statusText);
      return (<ErrorMessage messages={message} />);
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
        <div className="col-md-12">
          <h2>{userText}</h2>
          <p>
            <img src={image} width="64" height="64"/>
          </p>
          <p>
            Profile views: <Counter scope="users" id={this.props.params.uuid} />
          </p>
          <h3>Scenarios created</h3>
          <ScenariosNewest creator={this.props.params.uuid} />
        </div>
      </div>
    );
  }
});

export default UserAvatar;
