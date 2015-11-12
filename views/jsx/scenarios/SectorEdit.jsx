import React    from 'react';
import TagField from '../form-components/TagField.jsx';
import SectorSelector from '../SectorSelector.jsx';

var SectorEdit = React.createClass({
  predefinedSectors: [
    'public', 'transport', 'agriculture',
    'energy', 'retail', 'healthcare',
    'cultural', 'environment'
  ],
  getInitialState: function() {
    return this.handleInitalSectors(this.props);
  },
  componentWillReceiveProps : function(props) {
    this.setState(this.handleInitalSectors(props));
  },
  handleInitalSectors(props) {
    var s = {
      selectedSectors: [],
      newSectors: []
    };

    for (var i = 0; i < props.sectors.length; i++) {
      if (this.predefinedSectors.indexOf(props.sectors[i]) >= 0) {
        s.selectedSectors.push(props.sectors[i]);
      } else {
        s.newSectors.push(props.sectors[i]);
      }
    }
    return s;
  },
  handleSectors: function() {
    if (this.props.onChange) {
      // First, the predefined sectors, than the new sectors
      var allSectors = [];
      Array.prototype.push.apply(allSectors, this.state.selectedSectors);
      Array.prototype.push.apply(allSectors, this.state.newSectors);
      //console.log('Sectors:', allSectors);
      this.props.onChange(allSectors);
    }
  },
  handleNewSector: function(newSectors) {
    //console.log('newSectors:', newSectors);
    this.setState({newSectors: newSectors}, this.handleSectors);
  },
  handleSectorSelector: function(selectedSectors) {
    //console.log('selectedSectors:', selectedSectors);
    this.setState({selectedSectors: selectedSectors}, this.handleSectors);
  },
  render: function() {

    return (
      <div>


      </div>
    );
  }

});

export default SectorEdit;
