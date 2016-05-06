import $                    from 'jquery';
import ui                   from '../../../ui_routes.js';
import api                  from '../../../api_routes.js';
import React                from 'react';

import UserIsLoggedInMixin  from './../UserIsLoggedInMixin.jsx';
import I18nMixin            from '../i18n/I18nMixin.jsx';

{/*
  this component awllows to:
    - favorite a scenario
    - remove the favorite
    - display weather or not user has favorited the Scenario
    - [MAYBE SEPERATE COMPONENT] display number of favorites a scenario has recieved (x number of users have favorited this scenario)
*/}

var Favorite = React.createClass({
  mixins : [UserIsLoggedInMixin, I18nMixin],
  getInitialState: function() {
    return {
      userHasFavorited: false
    };
  },
  componentWillMount: function() {
    if (this.userIsLoggedIn()) {
      var index = currentUser.favorites ? currentUser.favorites.indexOf(this.props.scenario): -1;
      if (index > -1) {
        this.state.userHasFavorited = true;
        this.setState(this.state);
      }else {
        this.state.userHasFavorited = false;
        this.setState(this.state);
      }
    }
  },
  setFavorite: function() {
    var url = api.reverse('set_favorite', { uuid : currentUser.uuid });
    var fav = {
      scenario: this.props.scenario
    };
    $.ajax(url, {
      method: 'POST',
      dataType: 'json',
      data: fav,
      success : this.setState({
        userHasFavorited: true
      })
    });
  },
  removeFavorite: function() {
    var url = api.reverse('remove_favorite', { uuid : currentUser.uuid });
    var fav = {
      scenario: this.props.scenario
    };
    $.ajax(url, {
      method: 'PATCH',
      dataType: 'json',
      data: fav,
      success : this.setState({
        userHasFavorited: false
      })
    });
  },
  render: function() {
    if(!this.userIsLoggedIn()){
      return null;
    }
    return this.state.userHasFavorited ?
      <div onClick={this.removeFavorite} className="oc-tableview-bookmark-wrapper">
        <i className="fa fa-bookmark oc-tableview-bookmark-icon"></i>
          <span>{this.i18n('remove_bookmark', 'Remove bookmark')}</span>
          </div>:
      <div onClick={this.setFavorite} className="oc-tableview-bookmark-wrapper">
        <i className="fa fa-bookmark-o oc-tableview-bookmark-icon"></i>
        <span>{this.i18n('bookmark_scenario', 'Bookmark scenario')}</span>
        </div>;
    }
});

export default Favorite;
