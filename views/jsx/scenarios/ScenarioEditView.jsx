import React from 'react';

var ScenarioView = React.createClass({
    getInitialState: function () {
        return null;
    },
    componentDidMount: function () {
        $.getJSON('/scenarios/' + this.props.scenarioId, function (result) {
            if (this.isMounted()) {
                this.setState(result);
            }
        }.bind(this));
    },
    render: function () {
        if (this.state === null) {
            return null;
        }
        return (
            <div class="row">
                <table>
                    <thead>
                    <tr>
                        <th>Title</th>
                        <td>{this.state.title}</td>
                    </tr>
                    <tr>
                        <th>Created</th>
                        <td><time className="timeago" dateTime={this.state.created_at}>{this.state.created_at}</time></td>
                    </tr>
                    <tr>
                        <th>Created</th>
                        <td><time className="timeago" dateTime={this.state.updated_at}>{this.state.updated_at}</time></td>
                    </tr>
                    <tr>
                        <th>Creator</th>
                        <td><a href={"/users/"+this.state.owner}>{this.state.owner}</a></td>
                    </tr>
                    <tr>
                        <th>Description</th>
                        <td>{this.state.text.replace(/(?:\r\n|\r|\n)/g, '<br/>')}</td>
                    </tr>
                    <tr>
                        <th></th>
                        <td>
                            <ScenarioEditButton data={this.state}/>
                            <ScenarioDeleteButton data={this.state}/>
                        </td>
                    </tr>
                    </thead>
                </table>
            </div>
        )
    }
});

export default ScenarioView;
