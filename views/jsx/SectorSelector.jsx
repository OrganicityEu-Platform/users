import React    from 'react';
import TagField from './form-components/TagField.jsx';

import ui     from '../../ui_routes.js';

var SectorSelector = React.createClass({
  getInitialState: function() {
    return {
      selectedSectors: this.props.selected
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

    if (itemClass.indexOf('oc-tag-item-selected') >= 0) {
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

      var className = 'oc-tag-item';

      // Force lower case
      var s = this.props.sectors[i].toLowerCase();

      if (this.state.selectedSectors.indexOf(s) >= 0) {
        className = 'oc-tag-item oc-tag-item-selected';
      }

      sectorSelctors.push(
        <div key={s} className={className} data-sector={s} onClick={this.handleClick}>
          <img className="oc-tag-icon" src={ui.asset('static/img/'.concat(s.concat('_icon.svg')))}/>
          <span className="oc-tag-item-text">{s}</span>
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
