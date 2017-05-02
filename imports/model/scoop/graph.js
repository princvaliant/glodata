import { Class } from 'meteor/jagi:astronomy';

// Contains raw data information for particular record in Dcs collection

Graphs = new Mongo.Collection('graph');

let def = {
    name: 'Graph',
    collection: Graphs,
    fields: {
        // Reference to dc collection
        dcId: {
            type: String
        },
        idx: {
            type: Number
        },
        stepTag: {
            type: String
        },
        // Schema definition for raw data
        schema: {
            type: Object,
            optional: true
        },
        // Raw data with different schema
        pts: {
            type: Object
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
    indexes: {
        graphDcIndex: {
            fields: {
                dcId: 1,
                idx: 1
            }
        },
        graphStepTagTs: {
            fields: {
                stepTag: 1,
                ts: 1
            }
        },
        graphTsIndex: {
            fields: {
                ts: 1
            }
        }
    }
};

let cls = Class.create(def);

export default {
    def, cls
}