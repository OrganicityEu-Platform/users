var ScenarioEditButton = React.createClass({
    render: function () {
      return (
        <ol class="breadcrumb">
            <li><a href="/">Home</a></li>
            <li><a href="/scenarios">Scenarios</a></li>
            <li class="active"><%= scenario.title %></li>
        </ol>
      );
    }
});
