import ui    from '../../ui_routes.js';
import React from 'react';

var SectorIcon = React.createClass({
  getInitialState: function() {
    return {
      sectors: ['transport', 'retail', 'energy', 'environment', 'agriculture', 'healthcare', 'cultural', 'public']
    };
  },
  render: function() {

    var defaultSector = 'generic_sector_icon.svg';

    var arrayContains = (this.state.sectors.indexOf(this.props.sector.toLowerCase()) > -1);

    if(arrayContains) {
      return(
        <img
          className={this.props.className}
          src={ui.asset('static/img/'.concat(this.props.sector.toLowerCase()).concat('_icon.svg'))}/>
      );
    }else {
      return(
        <img
          className={this.props.className}
          src={ui.asset('static/img/'.concat(defaultSector))}/>
      );
    }
  }
});

export default SectorIcon;
