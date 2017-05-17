import $            from 'jquery';
import React        from 'react';
import LoadingMixin from '../LoadingMixin.jsx';
import api          from '../../../api_routes.js';

import Select       from 'react-select';
import Router       from 'react-router';

import I18nMixin    from '../i18n/I18nMixin.jsx';

var UserInterests = React.createClass({
  mixins: [I18nMixin],
  getInitialState: function() {
    return {
      optionsInterests: []
    };
  },
  componentDidMount: function() {
    var url = api.reverse('user_interests');
    $.ajax(url, {
      dataType : 'json',
      error : (jqXHR, textStatus, errorThrown) => {
        console.log(textStatus, errorThrown);
      },
      success : (interests) => {
        console.log(interests);
        this.setState({optionsInterests: interests}, function() {
          // done
        });
      }
    });
  },
  render: function() {
    return (
      <Select
        name="interests"
        value={this.props.value}
        options={this.state.optionsInterests}
        placeholder={this.i18n('Profile.interests_placeholder', 'Select...')}
        onChange={this.props.onChange}
        multi={true}/>
    );
  }
});

export default UserInterests;
