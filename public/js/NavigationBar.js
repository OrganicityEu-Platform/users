var NavigationBar = React.createClass({
    mixins: [UserIsLoggedInMixin],
    componentDidMount: function() {
      var componentNode = React.findDOMNode(this);
      var longestCnt = 0, longest = null;
      var menuItem = $(componentNode).find("a").each(function(idx, item) {
        $(item).parent().removeClass('active');
        var path = window.location.pathname;
        var href = item.getAttribute('href');
        if (path.indexOf(href) == 0) {
          if (longestCnt < path.length) {
            longestCnt = href.length;
            longest = $(item);
          }
        }
      });
      if (longest != null) {
        longest.parent().addClass('active');
      }
    },
    render: function () {
      var loginLogout, personal;
      if (this.userIsLoggedIn()) {
        personal = (
          <ul className="nav navbar-nav">
              <li><a href="/scenarios">Browse Scenarios</a></li>
              <li><a href="/scenarios/search">Search Scenarios</a></li>
              <li><a href="/scenarios/my">My Scenarios</a></li>
              <li><a href="/scenarios/create">Create Scenario</a></li>
              <li><a href="/profile">Profile</a></li>
          </ul>
        );
        loginLogout = (
          <ul className="nav navbar-nav navbar-right">
              <li><a href="/logout">Logout</a></li>
          </ul>
        );
      } else {
        personal = (
          <ul className="nav navbar-nav">
              <li><a href="/scenarios">Browse Scenarios</a></li>
              <li><a href="/scenarios/search">Search Scenarios</a></li>
          </ul>
        );
        loginLogout = (
          <ul className="nav navbar-nav navbar-right">
              <li><a href="/login">Login</a></li>
              <li><a href="/signup">Signup</a></li>
          </ul>
        );
      }
      return (
        <nav className="navbar navbar-default navbar-static-top">
            <div className="container-fluid">
                <div className="navbar-header">
                    <a className="navbar-brand" href="/">
                      <img alt="OrganiCity" src="/static/img/organicity_icon.png" width="81" height="40"/>
                    </a>
                </div>
                {personal}
                {loginLogout}
            </div>
        </nav>
      );
    }
});
