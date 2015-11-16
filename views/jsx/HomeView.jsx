import React from 'react';
import HomeViewHeader from './HomeViewHeader.jsx';
import HomeViewSection from './HomeViewSection.jsx';
import HomeViewFooter from './HomeViewFooter.jsx';

var HomeView = React.createClass({
  render : function() {
    return (
        <div className="row">
          <HomeViewHeader />
          <HomeViewSection />
          <HomeViewFooter />
        </div>
    );
  }
});

export default HomeView;
