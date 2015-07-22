// see http://www.aaron-powell.com/posts/2015-01-15-authentication-on-react-components.html
var UserIsOwnerMixin = {
    userIsOwner: function() {
        if (undefined === window.currentUser || null == window.currentUser) {
            return false;
        }
        return currentUser.uuid == this.props.data.owner;
    }
};


var ScenarioEditButton = React.createClass({
    mixins: [RoleRequiredMixin, UserIsOwnerMixin],
    handleClick: function () {
        window.location = '/scenarios/' + this.props.data._id + '/edit';
    },
    render: function () {
        if (this.permitted("admin") || this.userIsOwner()) {
            return (
                <button className="scenarioEdit btn btn-default" onClick={this.handleClick}>EDIT</button>
            );
        }
        return null;
    }
});

var ScenarioDeleteButton = React.createClass({
    mixins: [RoleRequiredMixin, UserIsOwnerMixin],
    handleClick: function () {
        $.ajax({
            url: '/scenarios/' + this.props.data._id,
            type: 'DELETE',
            success: function (result) {
                console.log('Deleted');
            }
        });
    },
    render: function () {
        if (this.permitted("admin") || this.userIsOwner()) {
            return (
                <button className="scenarioDelete btn btn-default btn-danger" onClick={this.handleClick}>DELETE</button>
            );
        }
        return null;
    }
});

var Scenario = React.createClass({
    mixins: [RoleRequiredMixin],
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

var ScenarioListItem = React.createClass({
    mixins: [RoleRequiredMixin],
    render: function () {
        return (
            <tr>
                <td className="scenarioListItemTitle"><a
                    href={"/scenarios/"+this.props.data._id}>{this.props.data.title}</a></td>
                <td className="scenarioListItemNarrative">{this.props.data.text.replace(/(?:\r\n|\r|\n)/g, '<br>')}</td>
                <td className="scenarioListItemOwner"><a
                    href={"/users/"+this.props.data.owner}>{this.props.data.owner}</a></td>
                <td className="scenarioListItemCreated">
                    <time className="timeago"
                          dateTime={(new Date(this.props.data.created_at)).toISOString()}>{(new Date(this.props.data.created_at)).toISOString()}</time>
                </td>
                <td className="scenarioListItemEdited">
                    <time className="timeago"
                          dateTime={(new Date(this.props.data.updated_at)).toISOString()}>{(new Date(this.props.data.updated_at)).toISOString()}</time>
                </td>
                <td><ScenarioEditButton data={this.props.data}/></td>
                <td><ScenarioDeleteButton data={this.props.data}/></td>
            </tr>
        )
    }
});

var ScenarioList = React.createClass({
    getInitialState: function () {
        return {
            scenarios: []
        };
    },
    componentDidMount: function () {
        $.getJSON('/scenarios', function (result) {
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
