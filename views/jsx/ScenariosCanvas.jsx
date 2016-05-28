import ui    from '../../ui_routes.js';
import React  from 'react';
//import PackeryMixin from 'react-packery-mixin';

var packeryOptions = {
  transitionDuration: '0.4s',
  itemSelector: '.oc-canvas-item',
  gutter: 15
};

var ScenariosCanvas = React.createClass({

  //mixins: [PackeryMixin("oc-canvas-pack", packeryOptions)],

  getInitialState: function() {
    return {
      isSorted: false,
      canvasItems: [{
        'sector' : 'public',
        'scenarios': 144
      }, {
        'sector' : 'transport',
        'scenarios': 55
      }, {
        'sector' : 'energy',
        'scenarios': 15
      }, {
        'sector' : 'retail',
        'scenarios': 500
      }, {
        'sector' : 'healthcare',
        'scenarios': 8
      }, {
        'sector' : 'agriculture',
        'scenarios': 19
      }, {
        'sector' : 'cultural',
        'scenarios': 88
      }, {
        'sector' : 'environment',
        'scenarios': 211}],

        XLitems: [],
        Litems: [],
        Mitems: [],
        Sitems: [],

        builtItems: []
      };
    },
    componentDidMount: function() {
      this.sortItems();
    },
    sortItems: function() {

      // canvasItems [{}]
      if(!this.state.isSorted) {
        this.state.canvasItems.sort(function(a, b){
          return a.scenarios - b.scenarios;
        });
      }

      // cluster size
      var size = 2;

      var S = this.state.canvasItems.splice(0, size);
      var s_special;

      var e;
      for(e = 0; e < S.length; e++) {
        S[e].size = "s";
        // each cluster has one special item
        // this item will have the largest number of scenarios in that cluster
        // and will be represented slightly larger for that cluster
        if(e === S.length - 1) { S[e].size = "s-special"; }
      }

      var M = this.state.canvasItems.splice(0, size);
      var m_special;

      var i;
      for(i = 0; i < M.length; i++) {
        M[i].size = "m";
        if(i === M.length - 1) { M[i].size = "m-special"; }
      }

      var L = this.state.canvasItems.splice(0, size);
      var l_special;

      var y;
      for(y = 0; y < L.length; y++) {
        L[y].size = "l";
        if(y === L.length - 1) { L[y].size = "l-special"; }
      }

      var XL = this.state.canvasItems.splice(0, this.state.canvasItems.length);
      var xl_special;

      var v;
      for(v = 0; v < XL.length; v++) {
        XL[v].size = "xl";
        if(v === XL.length - 1) { XL[v].size = "xl-special"; }
      }

      xl_special  = XL.pop();
      m_special   = M.pop();
      l_special   = L.pop();
      s_special   = S.pop();

      this.setState({
        Sitems: S,
        Mitems: M,
        Litems: L,
        XLitems: XL,
        builtItems: XL.concat(m_special, l_special, M, s_special, L, xl_special, S)
      });

    },
    buildItems: function() {

    },
    render: function() {
      return (
        <div
          className="oc-canvas-pack"
          ref="oc-canvas-pack">
          {
            this.state.builtItems.map(
              (item) =>
              <div className={"oc-canvas-item " + item.sector + "_colour " + item.size}>
                <img
                  className="oc-canvas-item-icon"
                  src={ui.asset('static/img/'.concat(item.sector.concat('_icon.svg')))}/>
                <span className="oc-canvas-item-text">
                  {item.sector.toUpperCase()}
                </span>
                <span>
                  {item.scenarios} scenarios
                </span>
              </div>
            )
          }
        </div>
      );
    }
  });

  export default ScenariosCanvas;
