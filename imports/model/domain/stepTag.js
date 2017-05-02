import {Class} from 'meteor/jagi:astronomy';

StepTags = new Mongo.Collection('steptag', {idGeneration: 'STRING'});

let def = {
    name: 'StepTag',
    collection: StepTags,
    fields: {
        // Name field of the report
        ctg: {
            type: String,
            grid: {
                width: 200
            },
            roles: 'ADMIN'
        },
        wc: {
            type: String,
            grid: {
                width: 200
            },
            roles: 'ADMIN'
        },
        step: {
            type: String,
            grid: {
                width: 200
            },
            roles: 'ADMIN'
        },
        name: {
            type: String,
            grid: {
                width: 200
            },
            roles: 'ADMIN'
        },
        idx: {
            type: Number,
            optional: true,
            grid: {
                width: 100
            },
            roles: 'ADMIN'
        },
        active: {
            type: Boolean,
            default: true,
            grid: {
                width: 200
            },
            roles: 'ADMIN'
        }
    },
    events: {
        beforeSave(e) {
            if (e.currentTarget.ctg && e.currentTarget.wc && e.currentTarget.step) {
                e.target.name = e.currentTarget.ctg + '__' + e.currentTarget.wc + '__' + e.currentTarget.step;
            } else if (e.currentTarget.name) {
                let names = e.currentTarget.name.split('__');
                if (names.length !== 3) {
                    Log.errThrow('steptag', 'Wrong step tag name', e.currentTarget.name);
                }
                e.target.ctg = names[0];
                e.target.wc = names[1];
                e.target.step = names[2];
            }
        }
    },
    behaviors: {
        timestamp: {}
    },
    indexes: {
        stepTagCtgWcStepActive: {
            fields: {
                ctg: 1,
                wc: 1,
                step: 1,
                active: 1
            }
        },
        stepTagNameActive: {
            fields: {
                name: 1,
                active: 1
            }
        },
        stepTagActiveIdx: {
            fields: {
                active: 1,
                idx: 1
            }
        }
    }
};

let cls = Class.create(def);

export default {
    def, cls
}