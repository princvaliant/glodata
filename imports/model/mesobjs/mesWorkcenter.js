import { Class } from 'meteor/jagi:astronomy';

MesWorkcenters = new Mongo.Collection('mes_workcenter', {idGeneration: 'STRING'});

let def = {
    name: 'MesWorkcenter',
    collection: MesWorkcenters,
    fields: {
        // Name field of the report
        title: {
            type: String,
            grid: {
                width: 200
            },
            roles: 'ADMIN'  // Who can edit the field (OWNER = user who created object)
        },
        active: {
            type: Boolean,
            grid: {
                width: 50
            },
            roles: 'ADMIN'  // Who can edit the field (OWNER = user who created object)
        },
        CREATED_DATE: {
            type: Date,
            grid: {
                width: 0
            }
        },
        SEQ_ID: {
            type: Number,
            precision: 0,
            grid: {
                width: 90
            }
        }
    },
    indexes: {
        workcenterActive: {
            fields: {
                active: 1
            }
        }
    }
};

let cls = Class.create(def);

export default {
    def, cls
}