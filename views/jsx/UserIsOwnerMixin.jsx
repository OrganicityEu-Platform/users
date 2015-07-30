// see http://www.aaron-powell.com/posts/2015-01-15-authentication-on-react-components.html
var UserIsOwnerMixin = {
    userIsOwner: function() {
        if (undefined === window.currentUser || null == window.currentUser) {
            return false;
        }
        return currentUser.uuid == this.props.data.owner;
    }
};

export default UserIsOwnerMixin;
