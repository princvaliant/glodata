import {Class} from 'meteor/jagi:astronomy';

ExporterVars = new Mongo.Collection('exporter_vars');

let def = {
    name: 'ExporterVar',
    collection: ExporterVars,
    fields: {
        // Name field of the report
        exporterId: {
            type: String,
            grid: {
                width: 0
            }
        },
        ctg: {
            type: String,
            grid: {
                width: 0
            }
        },
        idx: {
            type: Number,
            precision: 0,
            grid: {
                width: 0
            }
        },
        wc: {
            type: String,
            optional: true,
            grid: {
                width: 100,
                sortable: false,
                hideable: false
            }
        },
        step: {
            type: String,
            optional: true,
            grid: {
                width: 110,
                sortable: false,
                hideable: false
            }
        },
        name: {
            type: String,
            grid: {
                width: 160,
                sortable: false,
                hideable: false
            }
        },
        type: {
            type: String,
            grid: {
                width: 50,
                sortable: false,
                hideable: false
            }
        },
        title: {
            type: String,
            grid: {
                flex: 1,
                editor: true,
                sortable: false,
                hideable: false
            },
            roles: 'OWNER,ADMIN'
        },
        filter: {
            type: String,
            optional: true,
            grid: {
                flex: 2,
                editor: true,
                list: [],
                sortable: false,
                hideable: false
            },
            roles: 'OWNER,ADMIN'
        },
        link: {
            type: Boolean,
            optional: true,
            grid: {
                width: 50,
                sortable: false,
                hideable: false
            }
        },
        owner: {
            type: String,
            default  () {
                return Meteor.user().username || 'SYSTEM';
            },
            immutable: true
        },
        createdAt: {
            type: Date,
            grid: {
                width: 0
            }
        },
        updatedAt: {
            type: Date,
            grid: {
                width: 0
            }
        }
    },
    events: {

    },
    behaviors: {
        timestamp: {}
    },
    indexes: {
        exporterVarsIndex: {
            fields: {
                exporterId: 1,
                ctg: 1,
                idx: 1
            }
        }
    }
};

let cls = Class.create(def);

export default {
    def, cls
}