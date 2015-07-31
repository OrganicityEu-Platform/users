import React from 'react';
import $ from 'jquery';
import ScenarioListItem from './ScenarioListItem.jsx';

var ScenarioList = React.createClass({
    getInitialState: function () {
        return {
            scenarios: []
        };
    },
    componentDidMount: function () {
        $.getJSON('/api/v1/scenarios', function (result) {
            if (this.isMounted()) {
                this.setState({
                    scenarios: result
                });
            }
        }.bind(this));
    },
    render: function () {
        return (
            <div className="scenarioList">
                <table className="scenarioListTable">
                    <thead>
                    <tr>
                        <th>Title</th>
                        <th>Narrative</th>
                        <th>Creator</th>
                        <th>Created</th>
                        <th>Edited</th>
                        <th></th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.scenarios.map(function (scenario) {
                        return (
                            <ScenarioListItem key={scenario.id} data={scenario}/>
                        )
                    }, this)}
                    </tbody>
                </table>
            </div>
        );
    }
});

export default ScenarioList;
