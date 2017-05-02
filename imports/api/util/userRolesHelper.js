


export default userRolesHelper = {

    inRole: function(user, owner, accessRoles) {
        let roleList = [];
        if (_.isArray(accessRoles)) {
            roleList = accessRoles;
        } else if (accessRoles !== undefined) {
            roleList = accessRoles.split(',');
        }
        if (roleList.length === 0) {
            return true;
        }
        if (user === null || user === undefined) {
            return false;
        }
        if (_.indexOf(roleList, 'OWNER') >= 0 && user.username === owner) {
            return true;
        }
        let intsec = _.intersection(roleList, user.profile.roles);
        if (intsec.length > 0) {
            return true;
        }
        return false;
    }
}