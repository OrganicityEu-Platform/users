import React  from 'react';
import ui     from '../../ui_routes.js';

var SectorSelector = React.createClass({
  handleClick: function (event) {
    var itemClass     = event.currentTarget.className.toString();
    var selectedItem  = ' selected';
    var re = new RegExp(selectedItem, 'g');
    if (itemClass.indexOf(selectedItem) > -1) {
      event.currentTarget.className = itemClass.replace(re, '');
      console.log('deselected it');
    }
    if (itemClass.indexOf(selectedItem) <= -1) {
      console.log('selected it');
      event.currentTarget.className = itemClass.concat(selectedItem);
      this.selectedSectors.push(event.currentTarget.className.split('-')[0]);
      console.log(this.selectedSectors);
    }
  },
  render: function () {
    return (
      <div>
        <div className="public-sector-item-wrapper">
          <img className="public-sector-item" onClick={this.handleClick} src={ui.asset('static/img/noun_110491_cc.svg')}/>
          <span>public</span>
        </div>
        <div className="transport-sector-item-wrapper">
          <img className="transport-sector-item" onClick={this.handleClick} src={ui.asset('static/img/transport_sector_icon.svg')}/>
          <span>transport</span>
        </div>
        <div className="agriculture-sector-item-wrapper">
          <img className="agriculture-sector-item" onClick={this.handleClick} src={ui.asset('static/img/agriculture_sector_icon.svg')}/>
          <span>agriculture</span>
        </div>
        <div className="energy-sector-item-wrapper">
          <img className="energy-sector-item" onClick={this.handleClick} src={ui.asset('static/img/energy_sector_icon.svg')}/>
          <span>energy</span>
        </div>
        <div className="retail-sector-item-wrapper">
          <img className="retail-sector-item" onClick={this.handleClick} src={ui.asset('static/img/retail_sector_icon.svg')}/>
          <span>retail</span>
        </div>
        <div className="healthcare-sector-item-wrapper">
          <img className="healthcare-sector-item" onClick={this.handleClick} src={ui.asset('static/img/healthcare_sector_icon.svg')}/>
          <span>healthcare</span>
        </div>
        <div className="cultural-sector-item-wrapper">
          <img className="cultural-sector-item" onClick={this.handleClick} src={ui.asset('static/img/cultural_sector_icon.svg')}/>
          <span>cultural</span>
        </div>
        <div className="environment-sector-item-wrapper">
          <img className="environment-sector-item" onClick={this.handleClick} src={ui.asset('static/img/environment_sector_icon.svg')}/>
          <span>environment</span>
        </div>
      </div>
    );
  }

});

export default SectorSelector;
