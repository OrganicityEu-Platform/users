var key = 'ocScenarioCreate';
var ScenarioCreateMixin = {
  getInitialState: function () {
    if (window.sessionStorage && window.sessionStorage.getItem(key) != null) {
      return JSON.parse(window.sessionStorage.getItem(key));
    }
    return {
      title : '',
      summary : '',
      narrative : '',
      sectors : [],
      actors : [],
      devices : []
    };
  },
  clearState : function() {
    window.sessionStorage.removeItem('ocScenarioCreate');
  },
  saveState : function() {
    window.sessionStorage.setItem('ocScenarioCreate', JSON.stringify(this.state));
  }
};

export default ScenarioCreateMixin;
