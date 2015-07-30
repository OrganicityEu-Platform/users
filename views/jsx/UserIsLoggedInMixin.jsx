// see http://www.aaron-powell.com/posts/2015-01-15-authentication-on-react-components.html
var UserIsLoggedInMixin = {
    userIsLoggedIn: function() {
        if (undefined === window.currentUser || null == window.currentUser) {
            return false;
        }
        return true;
    }
};

export default UserIsLoggedInMixin;
