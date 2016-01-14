import React from 'react';
import HomeViewHeader from './HomeViewHeader.jsx';
import HomeViewSection from './HomeViewSection.jsx';
import HomeViewFooter from './HomeViewFooter.jsx';

var HomeView = React.createClass({
  render : function() {
    return (
        <div>
          <div className="row">
            <HomeViewHeader />
          </div>
          <HomeViewSection />
          <HomeViewFooter />
        </div>
    );
  }
});

export default HomeView;
