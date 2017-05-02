import { Class } from 'meteor/jagi:astronomy';

// Collection containing flattened data by ids information from Dcs collection
// Data is stored in steps object with stepTag keys.

Units = new Mongo.Collection('unit');

let def = {
    name: 'Unit',
    collection: Units,
    fields: {
        ids: {
            type: Object
        },
        idss: {
            type: [String],
            optional: true
        },
        meta: {
            type: Object,
            optional: true
        },
        ts: {
            type: Date
        },
        tsos: {
            type: Number,
            precision: 0,
            optional: true
        },
        search: {
            type: [String],
            optional: true
        },
        tags: {
            type: [String],
            optional: true
        },
        tagss: {
            type: [String],
            optional: true
        },
        parent: {
            type: String,
            optional: true
        },
        steps: {
            type: Object
        }
    },
    behaviors: {
        timestamp: {}
    },
    events: {
        beforeSave(e) {
            let search =  new Set();
            let idss =  new Set();
            let tags = new Set();
            let tagss = new Set();
            if (e.currentTarget.meta && _.isObject(e.currentTarget.meta)) {
                for (let field in e.currentTarget.meta) {
                    if (e.currentTarget.meta.hasOwnProperty(field) && e.currentTarget.meta[field]) {
                       search.add(e.currentTarget.meta[field].toString().toLowerCase());
                       search.add('__' + field.toString().toLowerCase() + '__' + e.currentTarget.meta[field].toString().toLowerCase());
                    }
                }
            }
            if (e.currentTarget.ids && _.isObject(e.currentTarget.ids)) {
                for (let field in e.currentTarget.ids) {
                    if (e.currentTarget.ids.hasOwnProperty(field) && e.currentTarget.ids[field]) {
                        idss.add(e.currentTarget.ids[field].toString().toLowerCase());
                        search.add(e.currentTarget.ids[field].toString().toLowerCase());
                    }
                }
            }
            if (e.currentTarget.steps && _.isObject(e.currentTarget.steps)) {
                for (let field in e.currentTarget.steps) {
                    if (e.currentTarget.steps.hasOwnProperty(field)) {
                        let token = field.split('__');
                        tags.add(token[0].toString().toLowerCase());
                        tags.add(token[0].toString().toLowerCase() + '__' + token[1].toString().toLowerCase());
                        tags.add(field.toString().toLowerCase());
                        tagss.add(token[0]);
                        tagss.add(token[1]);
                        tagss.add(token[2]);
                    }
                }
            }
            e.target.tags = [...tags].sort();
            e.target.tagss = [...tagss].sort();
            e.target.search =  [...search].sort();
            e.target.idss = [...idss].sort();
            if (_.isDate(e.currentTarget.ts)) {
                e.target.tsos = e.currentTarget.ts.getTimezoneOffset();
            }
        }
    },
    indexes: {
        unitIdssIndex: {
            fields: {
                idss: 1
            }
        },
        unitTagsIndex: {
            fields: {
                tags: 1,
                ts: 1
            }
        },
        unitTagssIndex: {
            fields: {
                tagss: 1,
                ts: 1
            }
        },
        unitSearchIndex: {
            fields: {
                search: 1,
                ts: 1
            }
        },
        unitTsIndex: {
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