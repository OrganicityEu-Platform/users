import React from 'react';

// Language codes:
// en-GB
// es-ES

// where current language is stored
const LOCAL_STORAGE_KEY = "organicity.lang";
// default language
const DEFAULT_LANG = "en-GB";

//
var I18nMixin = {
  getInitialState: function() {
    var currentLang;
    // key-value map for all languages
    var data = {};
    data.enGB = require('../../../lang/en-GB.json');
    data.esES = require('../../../lang/es-ES.json');

    // Read current language from localStorage. Use default if missing.
    currentLang = DEFAULT_LANG;
    try {
      var ls = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (ls && ls !== undefined) {
        currentLang = ls;
      }
    } catch (exp) {
      // survive, use default  (eg. iOS private mode)
    }

    return { "currentLang": currentLang, "data": data };
  },

  setCurrentLanguage: function(language) {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, language);
    } catch (exp) {
    }
    this.setState({currentLang: language});
    location.reload(); // TODO Shouldnt React be able to do this ???
  },

  isCurrentLanguage: function(language) {
    if (this.state.currentLang === language) {
      return true;
    } else {
      return false;
    }
  },

  currentLanguageDisplayName: function() {
    switch (this.state.currentLang) {
      case 'es-ES':
        return 'Espaniol';
      case 'en-GB':
      default:
        return 'English';
    }
  },

  /**
   * Translates string (key) based on current language
   */
  i18n: function(key, defaultValue) {
    var val;
    switch (this.state.currentLang) {
      case 'es-ES':
        val = this.state.data.esES[key];
        break;
      case 'en-GB':
      default:
        val = this.state.data.enGB[key];
    }

    if (val) {
      return val;
    } else {
      return defaultValue;
    }
  }

};

export default I18nMixin;
