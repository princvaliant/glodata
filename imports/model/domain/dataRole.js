import {Class} from 'meteor/jagi:astronomy';

DataRoles = new Mongo.Collection('datarole');

let def = {
    name: 'DataRole',
    collection: DataRoles,
    fields: {
        // Name of data role
        name: {
            type: String,
            grid: {
                width: 150
            }
        },
        // object that represents rules/filters for data to be retrieved
        ruleTags: {
            type: String,
            optional: true,
            grid: {
                width: 120,
                editor: true
            }
        },
        ruleFilter: {
            type: String,
            optional: true,
            grid: {
                width: 120,
                editor: true
            }
        },
        active: {
            type: Boolean,
            default: true,
            grid: {
                width: 60,
                editor: true
            }
        },
        createdAt: {
            type: Date,
            optional: true,
            grid: {
                width: 0
            }
        },
        updatedAt: {
            type: Date,
            optional: true,
            grid: {
                width: 0
            }
        }
    },
    behaviors: {
        timestamp: {}
    },
    events: {
        beforeSave(e) {

        }
    },
    indexes: {
        dataRoleNameIndex: {
            fields: {
                name: 1
            },
            options: {
                unique: true
            }
        }
    }
};

let cls = Class.create(def);

export default {
    def, cls
}