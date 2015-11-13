import React    from 'react';
import TagField from './form-components/TagField.jsx';

import ui     from '../../ui_routes.js';

var SectorSelector = React.createClass({
  getInitialState: function() {
    return {
      selectedSectors: []
    };
  },
  componentWillReceiveProps : function(props) {
    this.setState({selectedSectors: props.selected});
  },
  handleNewSector: function(newSectors) {
    //console.log('newSectors:', newSectors);
    this.setState({newSectors: newSectors}, this.handleSectors);
  },
  handleClick: function(event) {
    var itemClass     = event.currentTarget.className.toString();
    var selectedSectors = this.state.selectedSectors;
    var sector = event.currentTarget.dataset.sector;
    //console.log(sector);

    if (itemClass.indexOf('sector-item-selected') >= 0) {
      //console.log('deselected it');
      var toRemove = selectedSectors.indexOf(sector);
      if (toRemove > -1) {
        selectedSectors.splice(toRemove, 1);
      }
    } else {
      //console.log('selected it!');
      selectedSectors.push(sector);
    }

    //console.log('selectedSectors:', selectedSectors);
    this.setState({selectedSectors: selectedSectors}, () => {
      if (this.props.onChange) {
        this.props.onChange(selectedSectors);
      }
    });
  },
  render: function() {

    //console.log('SectorSelector.render', this.state.selectedSectors);

    var sectorSelctors = [];
    for (var i = 0; i < this.props.sectors.length; i++) {

      var className = 'sector-item'
      if(this.state.selectedSectors.indexOf(this.props.sectors[i]) >= 0) {
        className = 'sector-item sector-item-selected';
      }

      sectorSelctors.push(
        <div className={className} data-sector={this.props.sectors[i]} onClick={this.handleClick}>
          <img className="sector-icon" src={ui.asset('static/img/'.concat(this.props.sectors[i].concat('_icon.svg')))}/>
          <span className="sector-item-text">{this.props.sectors[i]}</span>
        </div>
      );
    }

    return (
      <div>
        {sectorSelctors}
      </div>
    );
  }

});

export default SectorSelector;
