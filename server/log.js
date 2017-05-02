import { Class } from 'meteor/jagi:astronomy';

let _Logs = new Mongo.Collection('log', {idGeneration: 'STRING'});
let _Log = Class.create({
    name: 'Log',
    collection: _Logs,
    fields: {
        module: {
            type: String
        },
        message: {
            type: String
        },
        reason: {
            type: String
        },
        details: {
            type: String,
            optional: true
        },
        user: {
            type: String,
            optional: true
        },
        ts: {
            type: Date
        }
    },
    indexes: {
        logModule: {
            fields: {
                module: 1,
                message: 1
            }
        },
        logTs: {
            fields: {
                ts: 1
            }
        }
    }
});

Log = {
    err: function (module, error, reason, details, user) {
        let log = new _Log();
        log.module = module;
        log.message = error;
        log.reason = reason;
        if (details) {
            log.details = JSON.stringify(details).replace(/\"/g, '\'');
        }
        log.user = user;
        log.ts = new Date();
        log.save();
    },
    errThrow: function (module, error, reason, details, user) {
        let log = new _Log();
        log.module = module;
        log.message = error;
        log.reason = reason;
        if (details) {
            log.details = JSON.stringify(details).replace(/\"/g, '\'');
        }
        log.ts = new Date();
        log.user = user;;
        log.save();
        throw new Meteor.Error(error, reason, details);
    }
};

