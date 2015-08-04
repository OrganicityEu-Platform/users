var ScenarioCreateMixin = {
  getInitialState: function () {
    console.log(window.localStorage.ocScenarioCreate);
    if (window.localStorage && window.localStorage.ocScenarioCreate && window.localStorage.ocScenarioCreate !== undefined) {
      return JSON.parse(window.localStorage.ocScenarioCreate);
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
    window.localStorage.ocScenarioCreate = undefined;
  },
  saveState : function() {
    window.localStorage.ocScenarioCreate = JSON.stringify(this.state);
  }
};

export default ScenarioCreateMixin;
