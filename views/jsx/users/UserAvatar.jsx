import $            from 'jquery';
import React        from 'react';
import LoadingMixin from '../LoadingMixin.jsx';
import api          from '../../../api_routes.js';

var Router = require('react-router');
var Link = Router.Link;

var UserAvatar = React.createClass({
  mixins: [LoadingMixin],
  getInitialState: function() {
    return {
      loading: true,
      userName: null
    };
  },
  componentDidMount: function() {

    if (!this.props.uuid && !this.props.name) {
      this.loaded();
      return;
    }

    if (this.props.name) {
      this.state.userName = this.props.name;
      this.loaded();
      return;
    }

    console.log("did not get username. reloading...");

    this.loading();
    var url = api.reverse('user_info', { uuid : this.props.uuid });
    $.ajax(url, {
      dataType : 'json',
      error : (jqXHR, textStatus, errorThrown) => {
        this.setState(this.state);
        this.loaded();
      },
      success : (user) => {
        this.setState({userName: user.name}, function() {
          this.loaded();
        });
      }
    });
  },
  render: function() {

    if (this.state.loading) {
      return <span>Loading...</span>;
    }

    var userText = this.state.userName
      ? this.state.userName
      : 'Unknown user';

    if (!this.props.uuid) {
      return (<span><i>{userText}</i></span>);
    }

    return (
      <span className="user-avatar">
        <Link to="userView" params={{ uuid: this.props.uuid }}>{userText}</Link>
      </span>
    );
  }
});

export default UserAvatar;
