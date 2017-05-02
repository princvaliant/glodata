/**
 * Created by aleksandarvolos on 3/4/16.
 */

if (Meteor.isServer) {

    Accounts.config({
        sendVerificationEmail: true,
        restrictCreationByEmailDomain: function (address) {
            let arr = address.match(/apple\.com|avolos@gmail.com|mmodric@yahoo.com/i);
            return (arr !== null);
        }
    });

    Accounts.emailTemplates = {
        from: 'GLO App Support <no-reply@daasfab.com>',
        siteName: Meteor.absoluteUrl().replace(/^https?:\/\//, '').replace(/\/$/, ''),

        resetPassword: {
            subject: function () {
                return 'How to reset your password on ' + Accounts.emailTemplates.siteName;
            },
            text: function (user, url) {
                let url2 = url.replace('#/reset-password/', '#:auth:reset:');
                let greeting = (user.profile && user.profile.name) ?
                    ('Hello ' + user.profile.name + ',') : 'Hello,';
                return greeting + '\n' + '\n' + 'To reset your password, simply click the link below.\n' +
                    '\n' + url2 + '\n' + '\n' + 'Thanks.\n';
            }
        },
        verifyEmail: {
            subject: function () {
                return 'GLO App verify email address on ' + Accounts.emailTemplates.siteName;
            },
            text: function (user, url) {
                let greeting = (user.profile && user.profile.name) ?
                    ('Hello ' + user.profile.name + ',') : 'Hello,';
                return greeting + '\n' + '\n' + 'To verify your account email, simply click the link below.\n' +
                    '\n' + url + '\n' + '\n' + 'Thanks.\n';
            }
        },
        enrollAccount: {
            subject: function () {
                return 'GLO App account has been created for you on ' + Accounts.emailTemplates.siteName;
            },
            text: function (user, url) {
                let greeting = (user.profile && user.profile.name) ?
                    ('Hello ' + user.profile.name + ',') : 'Hello,';
                return greeting + '\n' + '\n' + 'To start using the service, simply click the link below.\n' +
                    '\n' + url + '\n' + '\n' + 'Thanks.\n';
            }
        }
    };
}

if (Meteor.isClient) {

    Accounts.can = function (roles, usr) {
        if (!roles || roles.length === 0) {
            return true;
        }
        let user = usr || Meteor.users.findOne({_id: Meteor.userId()});
        if (!user || !user.profile.roles || user.profile.roles.length === 0) {
            return false;
        }
        let inter = _.intersection(user.profile.roles, roles);
        return inter.length > 0;
    };

    Accounts.isAdmin = function () {
        let user = Meteor.users.findOne({_id: Meteor.userId()});
        return _.indexOf(user.profile.roles, 'ADMIN') >= 0;
    };

    Accounts.isSupervisor = function () {
        let user = Meteor.users.findOne({_id: Meteor.userId()});
        return _.indexOf(user.profile.roles, 'SUPERVISOR') >= 0;
    };

}
