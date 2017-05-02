import {Class} from 'meteor/jagi:astronomy';
import './stepTag';

Variables = new Mongo.Collection('variable', {idGeneration: 'STRING'});

let def = {
    name: 'Variable',
    collection: Variables,
    fields: {
        ctg: {
            type: String
        },
        wc: {
            type: String,
            optional: true
        },
        step: {
            type: String,
            optional: true,
        },
        name: {
            type: String,
            grid: {
                width: 300
            }
        },
        title: {
            type: String,
            optional: true,
            grid: {
                width: 300,
                editor: true
            }
        },
        type: {
            type: String,
            grid: {
                width: 150,
                editor: true
            }
        },
        search: {
            type: [String],
            default: [],
            optional: true
        },
        active: {
            type: Boolean,
            grid: {
                width: 120,
                editor: true
            }
        },
        important: {
            type: Boolean,
            grid: {
                width: 120,
                editor: true
            }
        }
    },
    events: {
        beforeSave(e) {
            let search = new Set();
            if (_.isString(e.currentTarget.name)) {
                _.each(e.currentTarget.name.split('_'), (o) => {
                    if (o.trim() !== '')
                        search.add(o.toLowerCase().replace(/[^\w\s]/gi, ''));
                });
            }
            e.target.search = [...search].sort();
        }
    },
    indexes: {
        variableCtgWcStepNameActive: {
            fields: {
                ctg: 1,
                wc: 1,
                step: 1,
                name: 1,
                active: 1
            }
        },
        variableSearchActiveCtg: {
            fields: {
                search: 1,
                ctg: 1,
                active: 1
            }
        },
        variableCtgNameActive: {
            fields: {
                ctg: 1,
                name: 1,
                active: 1
            }
        }
    }
};

let cls = Class.create(def);

export default {
    def, cls
}