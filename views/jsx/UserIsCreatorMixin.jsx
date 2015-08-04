// see http://www.aaron-powell.com/posts/2015-01-15-authentication-on-react-components.html
var UserIsCreatorMixin = {
    userIsCreator: function(scenario) {
        if (undefined === window.currentUser || null == window.currentUser) {
            return false;
        }
        return currentUser.uuid == scenario.creator;
    }
};

export default UserIsCreatorMixin;
