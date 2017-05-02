export default {

    roleFilter: function (userId) {
        let tags = [];
        let filter = [];
        let user = userId ? Meteor.users.findOne(userId) : Meteor.user();
        let droles = DataRoles.find({name: {$in: user.profile.dataRoles}, active: true}).fetch();
        _.each(droles, (drole) => {
            if (drole.ruleTags) {
                tags.push(drole.ruleTags);
            }
            if (drole.ruleFilter) {
                filter.push(drole.ruleFilter);
            }
        });
        let ret = [];
        if (tags.length > 0) {
            ret.push({tags: {'$in': tags}});
        }
        if (filter.length > 0) {
            ret.push({search: {'$in': filter}});
        }
        return ret;
    }
}