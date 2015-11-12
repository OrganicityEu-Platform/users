import React  from 'react';
import ui     from '../../ui_routes.js';

var selectedSectors = [];
var SectorSelector = React.createClass({
  handleClick: function (event) {
    var itemClass     = event.currentTarget.className.toString();
    var selectedItem  = ' selected';
    var re = new RegExp(selectedItem, 'g');
    if (itemClass.indexOf(selectedItem) > -1) {
      console.log('deselected it');
      var toRemove = selectedSectors.indexOf(itemClass.split('-')[0]);
      if (toRemove > -1) {
        selectedSectors.splice(toRemove, 1);
      }
      event.currentTarget.className = itemClass.replace(re, '');
    }
    if (itemClass.indexOf(selectedItem) == -1) {
      console.log('selected it!');
      event.currentTarget.className = itemClass.concat(selectedItem);
      selectedSectors.push(event.currentTarget.className.split('-')[0]);
      console.log(selectedSectors);
    }
  },
  render: function () {
    return (
      <div>
        <div className="public-sector-item sector-item" onClick={this.handleClick}>
          <span>public</span>
        </div>
        <div className="transport-sector-item sector-item" onClick={this.handleClick}>
          <span>transport</span>
        </div>
        <div className="agriculture-sector-item-wrapper sector-item" onClick={this.handleClick}>
          <span>agriculture</span>
        </div>
        <div className="energy-sector-item-wrapper sector-item" onClick={this.handleClick}>
          <span>energy</span>
        </div>
        <div className="retail-sector-item-wrapper sector-item" onClick={this.handleClick}>
          <span>retail</span>
        </div>
        <div className="healthcare-sector-item-wrapper sector-item" onClick={this.handleClick}>
          <span>healthcare</span>
        </div>
        <div className="cultural-sector-item-wrapper sector-item" onClick={this.handleClick}>
          <span>cultural</span>
        </div>
        <div className="environment-sector-item-wrapper sector-item" onClick={this.handleClick}>
          <span>environment</span>
        </div>
      </div>
    );
  }

});

export default SectorSelector;
