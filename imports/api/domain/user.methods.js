
Meteor.methods({

    userGet: function (id) {
        return Meteor.users.findOne({_id:id});
    },

    userList: function (filter, options) {
        let query = {};
        if (filter.search) {
            query = {$and: []};
            _.each(filter.search.split(' '), (srch) => {
                if (!_.isEmpty(srch.trim())) {
                    query.$and.push({username: {$regex: srch.trim().toLowerCase()}})
                }
            });
        }
        let data = Meteor.users.find(query, options || {}).fetch();
        return {
            total: Meteor.users.find(query).count(),
            data: _.map(data, (o) => {
                let lastLogin = '';
                if (o.services.resume && o.services.resume.loginTokens && o.services.resume.loginTokens.length > 0) {
                    let pos = o.services.resume.loginTokens.length - 1;
                    lastLogin = o.services.resume.loginTokens[pos].when
                }
                return {
                    _id: o._id,
                    username: o.username,
                    email: o.emails[0].address,
                    verified: o.emails[0].verified,
                    lastLogin: lastLogin,
                    roles: o.profile.roles || [],
                    dataRoles: o.profile.dataRoles || [],
                    first: o.profile.first,
                    last: o.profile.last,
                    company: o.profile.company
                }
            })
        };
    },
    userUpdate: function (record) {
        let user = {profile: {}};
        user.username = record.username;
        user.emails = [
            {
                address: record.email,
                verified: record.verified
            }
        ];
        user.profile.roles = record.roles;
        user.profile.dataRoles = record.dataRoles;
        user.profile.first = record.first;
        user.profile.last = record.last;
        user.profile.company = record.company;
        return Meteor.users.update({_id: record._id}, {$set: user});
    },
    userDestroy: function (record) {
        Meteor.users.remove(record._id);
    },

    getAccessToken : function() {
        try {
            let tokens = Meteor.user().services.resume.loginTokens;
            return tokens[tokens.length -1].hashedToken;
        } catch(e) {
            return null;
        }
    }
});