import { Class } from 'meteor/jagi:astronomy';

// Collection containing data that are extracted and calculated from various files.
// It usually contains record(s) in Graphs collection containing raw data information (charting, calculation).
// There are 3 crucial fields:
//   ids - object containing unique identifiers for the record. It is indexed in search.
//   meta - object containing various information that will be indexed in search
//   vars - contains data related to this particular step


Dcs = new Mongo.Collection('dc');

let def = {
    name: 'Dc',
    collection: Dcs,
    fields: {
        // Category (wafer, die, equipment, area etc)
        ctg: {
            type: String
        },
        // Workcenter (epi, fab ...)
        wc: {
            type: String,
            grid: {
                width: 120
            }
        },
        // Step (pl, nidot etc)
        step: {
            type: String,
            grid: {
                width: 120
            }
        },
        // Timestamp when the measurement is done (Populated from raw files)
        ts: {
            type: Date,
            grid: {
                width: 120
            }
        },
        fileId: {
            type: Object,
            optional: true
        },
        // Offset of the timestamp
        tsos: {
            type: Number,
            precision: 0,
            optional: true
        },
        // List of identifiers for the object
        ids: {
            type: Object
        },
        // Optional meta data
        meta: {
            type: Object,
            optional: true
        },
        search: {
            type: [String],
            optional: true
        },
        // Object containing all relevant variable values for this step
        vars: {
            type: Object
        },
        // Optional notes
        notes: {
            type: String,
            optional: true
        },
        // User that performed test
        user: {
            type: String,
            optional: true
        },
        // If this record needs reference to parent (example Die -> Wafer)
        parent: {
            type: String,
            optional: true
        },
        // Flag to determine if this record is synced to unit collection
        _syncId: {
            type: String,
            optional: true
        },
        // Auto populated date when record is inserted
        createdAt: {
            type: Date,
            grid: {
                width: 0
            }
        },
        // Auto populated date when record is updated
        updatedAt: {
            type: Date,
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
            let search = new Set();
            if (e.currentTarget.meta && _.isObject(e.currentTarget.meta)) {
                for (let field in e.currentTarget.meta) {
                    if (e.currentTarget.meta.hasOwnProperty(field)) {
                        if (e.currentTarget.meta[field] ) {
                            search.add(e.currentTarget.meta[field].toString().toLowerCase());
                        }
                    }
                }
            }
            if (e.currentTarget.ids && _.isObject(e.currentTarget.ids)) {
                for (let field in e.currentTarget.ids) {
                    if (e.currentTarget.ids.hasOwnProperty(field)) {
                        if (e.currentTarget.ids[field]) {
                            search.add(e.currentTarget.ids[field].toString().toLowerCase());
                        }
                    }
                }
            }
            e.target.search = [...search];
            if (_.isDate(e.currentTarget.ts)) {
                e.target.tsos = e.currentTarget.ts.getTimezoneOffset();
            }
        }
    },
    indexes: {
        dcCtgWcStepTsIndex: {
            fields: {
                ctg: 1,
                wc: 1,
                step: 1,
                ts: 1
            }
        },
        dcStepTsIndex: {
            fields: {
                step: 1,
                ts: 1
            }
        },
        dcSyncIdTsIndex: {
            fields: {
                _syncId: 1,
                ts: 1
            }
        },
        dcFileIdIndex: {
            fields: {
               fileId: 1
            }
        },
        dcSearchIndex: {
            fields: {
                search: 1
            }
        },
        dcUserIndex: {
            fields: {
                user: 1
            }
        }
    }
};

let cls = Class.create(def);

export default {
    def, cls
}