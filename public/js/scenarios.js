var ScenarioEditButton = React.createClass({
  mixins: [RoleRequiredMixin],
  handleClick: function() {
    window.location = '/scenarios/' + this.props.data._id + '/edit';
  },
  render: function() {
    if (this.permitted("admin") || (undefined !== window.currentUser && window.currentUser.id == this.props.data.owner)) {
      return (
        <button className="scenarioEdit btn btn-default" onClick={this.handleClick}>EDIT</button>
      );
    }
    return null;
  }
});

var ScenarioDeleteButton = React.createClass({
  mixins: [RoleRequiredMixin],
  handleClick: function() {
    $.ajax({
      url: '/scenarios/' + this.props.data._id,
      type: 'DELETE',
      success: function(result) {
          console.log(this.refs);
      }
    });
  },
  render: function() {
    if (this.permitted("admin")) {
      return (
        <button className="scenarioDelete btn btn-default btn-danger" onClick={this.handleClick}>DELETE</button>
      );
    }
    return null;
  }
});

var Scenario = React.createClass({
  mixins: [RoleRequiredMixin],
  getInitialState: function() {
    return {};
  },
  componentDidMount: function() {
    $.getJSON('/scenarios/' + this.props.scenarioId, function(result) {
      if (this.isMounted()) {
        this.setState(result);
      }
    }.bind(this));
  },
  render: function() {
    return (
      <div class="row">
        <h2 className="scenarioTitle">
          {this.state.title}
          <small>
            Created <time className="timeago" dateTime={(new Date(this.state.created_at)).toISOString()}>{(new Date(this.state.created_at)).toISOString()}</time>,
            Modified <time className="timeago" dateTime={(new Date(this.state.updated_at)).toISOString()}>{(new Date(this.state.updated_at)).toISOString()}</time>
            by <a href={"/users/"+this.state.owner}>{this.state.owner}</a>
          </small>
        </h2>
        <p className="scenarioText">{this.state.text.replace(/(?:\r\n|\r|\n)/g, '<br>')}</p>
        <p>
          <ScenarioEditButton data={this.state} />
          <ScenarioDeleteButton data={this.state} />
        </p>
      </div>
    )
  }
});

var ScenarioListItem = React.createClass({
  mixins: [RoleRequiredMixin],
  render: function() {
    return (
      <tr>
        <td className="scenarioListItemTitle"><a href={"/scenarios/"+this.props.data._id}>{this.props.data.title}</a></td>
        <td className="scenarioListItemNarrative">{this.props.data.text.replace(/(?:\r\n|\r|\n)/g, '<br>')}</td>
        <td className="scenarioListItemOwner"><a href={"/users/"+this.props.data.owner}>{this.props.data.owner}</a></td>
        <td className="scenarioListItemCreated"><time className="timeago" dateTime={(new Date(this.props.data.created_at)).toISOString()}>{(new Date(this.props.data.created_at)).toISOString()}</time></td>
        <td className="scenarioListItemEdited"><time className="timeago" dateTime={(new Date(this.props.data.updated_at)).toISOString()}>{(new Date(this.props.data.updated_at)).toISOString()}</time></td>
        <td><ScenarioEditButton data={this.props.data} /></td>
        <td><ScenarioDeleteButton data={this.props.data} /></td>
      </tr>
    )
  }
});

var ScenarioList = React.createClass({
  getInitialState: function() {
    return {
      scenarios: []
    };
  },
  componentDidMount: function() {
    $.getJSON('/scenarios', function(result) {
      if (this.isMounted()) {
        this.setState({
          scenarios: result
        });
      }
    }.bind(this));
  },
  render: function() {
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
            {this.state.scenarios.map(function(scenario) {
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
