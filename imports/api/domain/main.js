import './fileMeta.methods';
import './stepTag.methods';
import './variable.methods';
import './user.methods';
import './dataRole.methods';

Meteor.methods({
    env: function (field) {
        return process.env.ROOT_URL;
    }
});