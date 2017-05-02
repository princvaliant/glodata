import { Class } from 'meteor/jagi:astronomy';

MesSteps = new Mongo.Collection('mes_steps', {idGeneration: 'STRING'});

let def = {
    name: 'MesStep',
    collection: MesSteps,
    fields: {
        sc: {
            type: String,
            grid: {
                width: 100
            },
            roles: 'ADMIN'
        },
        route: {
            type: String,
            grid: {
                width: 100
            },
            roles: 'ADMIN'
        },
        title: {
            type: String,
            grid: {
                width: 100
            },
            roles: 'ADMIN'
        },
        OBJECT_ID: {
            type: String,
            grid: {
                width: 200
            },
            roles: 'ADMIN'
        },
        OBJECT_TYPE: {
            type: String,
            grid: {
                width: 200
            },
            roles: 'ADMIN'
        },
        ACTIVE: {
            type: String,
            grid: {
                width: 50
            },
            roles: 'ADMIN'
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
        stepActive: {
            fields: {
                ACTIVE: 1
            }
        }
    }
};

let cls = Class.create(def);

export default {
    def, cls
}