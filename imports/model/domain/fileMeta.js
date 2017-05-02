import {Class} from 'meteor/jagi:astronomy';

// Collection defines meta data for python workers that listen on folders and upload file data
// to Files collection. stepTag is crucial information that needs to be provided so appropriate parser job
// can pick it up and process it.

FileMetas = new Mongo.Collection('filemeta');

let def = {
    name: 'FileMeta',
    collection: FileMetas,
    fields: {
        // Server/computer name where crawler is runningm
        crawlerServer: {
            type: String,
            grid: {
                width: 110,
                editor: true
            }
        },
        // Server/computer name where data is located. Used for drive mapping.
        dataServer: {
            type: String,
            grid: {
                width: 120,
                editor: true
            }
        },
        // File path to dataServer where the data files are located
        dataPath: {
            type: String,
            grid: {
                width: 250,
                editor: true
            }
        },
        // Regex that determines which files are picked up
        fileContains: {
            type: [String],
            optional: true,
            grid: {
                width: 137,
                editor: true
            }
        },
        fileExclude: {
            type: [String],
            optional: true,
            grid: {
                width: 137,
                editor: true
            }
        },
        dirContains: {
            type: [String],
            optional: true,
            grid: {
                width: 170,
                editor: true
            }
        },
        dirExclude: {
            type: [String],
            optional: true,
            grid: {
                width: 170,
                editor: true
            }
        },
        metaObject: {
            type: Object,
            optional: true
        },
        lastSyncAt: {
            type: Date,
            optional: true,
            grid: {
                width: 80,
                editor: true
            }
        },
        // CTG __ WC __ STEP  to map this file types to particular step processor
        stepTag: {
            type: String,
            optional: true,
            grid: {
                width: 350,
                editor: true
            }
        },
        // Regex expression to extract ids from the file name
        fileIds: {
            type: String,
            optional: true,
            grid: {
                width: 0
            }
        },
        // Flag determines if file scan need to go to subfolders
        subfolders: {
            type: Boolean,
            optional: true,
            grid: {
                width: 60,
                editor: true
            }
        },
        // Flagif files replace existing
        replaceExisting: {
            type: Boolean,
            optional: true,
            grid: {
                width: 60,
                editor: true
            }
        },
        active: {
            type: Boolean,
            default: false,
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
        },
        search: {
            type: [String],
            optional: true
        }
    },
    behaviors: {
        timestamp: {}
    },
    events: {
        beforeSave(e) {
            let search = new Set();
            if (_.isString(e.currentTarget.crawlerServer) && !_.isEmpty(e.currentTarget.crawlerServer.trim())) {
                search.add(e.currentTarget.crawlerServer.toLowerCase());
            }
            if (_.isString(e.currentTarget.dataServer) && !_.isEmpty(e.currentTarget.dataServer.trim())) {
                search.add(e.currentTarget.dataServer.toLowerCase());
            }
            if (_.isString(e.currentTarget.dataPath) && !_.isEmpty(e.currentTarget.dataPath.trim())) {
                _.each(e.currentTarget.dataPath.split(/\/|\\/g), (o) => {
                    if (o.trim() !== '') search.add(o.toLowerCase());
                });
            }
            if (_.isString(e.currentTarget.stepTag) && !_.isEmpty(e.currentTarget.stepTag.trim())) {
                _.each(e.currentTarget.stepTag.split('__'), (o) => {
                    if (o.trim() !== '') search.add(o.toLowerCase());
                });
            }
            e.target.search = [...search].sort();

            if (_.isString(e.currentTarget.fileContains) && !_.isEmpty(e.currentTarget.fileContains.trim())) {
                e.target.fileContains = e.currentTarget.fileContains.split(/,/g);
            } else {
                e.target.fileContains = [];
            }
            if (_.isString(e.currentTarget.fileExclude) && !_.isEmpty(e.currentTarget.fileExclude.trim())) {
                e.target.fileExclude = e.currentTarget.fileExclude.split(/,/g);
            } else {
                e.target.fileExclude = [];
            }
            if (_.isString(e.currentTarget.dirContains) && !_.isEmpty(e.currentTarget.dirContains.trim())) {
                e.target.dirContains = e.currentTarget.dirContains.split(/,/g);
            } else {
                e.target.dirContains = [];
            }
            if (_.isString(e.currentTarget.dirExclude) && !_.isEmpty(e.currentTarget.dirExclude.trim())) {
                e.target.dirExclude = e.currentTarget.dirExclude.split(/,/g);
            } else {
                e.target.dirExclude = [];
            }
        }
    },
    indexes: {
        fileMetaDataServerDataPath: {
            fields: {
                dataServer: 1,
                dataPath: 1
            }
        },
        fileMetaSearch: {
            fields: {
                search: 1
            }
        },
        fileMetaCtgWcStep: {
            fields: {
                stepTag: 1
            }
        }
    }
};

let cls = Class.create(def);

export default {
    def, cls
}