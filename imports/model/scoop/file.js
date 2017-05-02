import { Class } from 'meteor/jagi:astronomy';

// Contains uploaded file data. It is used by various parser job processors to
// extract data and load it in the dc and graph collections.


Files = new Mongo.Collection('file');

// let imageStore = new FS.Store.GridFS("images", {
//     maxTries: 1,
//     chunkSize: 1024*1024
// });
// Images = new FS.Collection("images", {
//     stores: [imageStore]
// });

let def = {
    name: 'File',
    collection: Files,
    fields: {
        // Server/computer name where file originated from
        dataServer: {
            type: String
        },
        // File path
        dataPath: {
            type: String
        },
        // File name
        fileName: {
            type: String
        },
        // File extension
        fileExt: {
            type: String,
            optional: true
        },
        // File size
        fileSize: {
            type: Number
        },
        // CTG __ WC __ STEP  to map this file types
        stepTag: {
            type: String
        },
        // Meta object that will be copied to DC meta object
        meta: {
            type: Object,
            optional: true
        },
        // Timestamp when file is modified on disk
        ts: {
            type: Date
        },
        // Timestamp when record is created
        createdAt: {
            type: Date,
            optional: true
        },
        // Timestamp when record is updated
        updatedAt: {
            type: Date,
            optional: true
        },
        // BASE64 encoded content if files are not text files
        content: {
            type: String
        },
        encoding: {
            optional: true,
            type: String
        },
        // Flag to determine if this record is processed to dc collection
        _syncId: {
            type: String,
            optional: true
        }
    },
    indexes: {
        fileStepTagSyncIdIndex: {
            fields: {
                stepTag: 1,
                _syncId: 1,
                ts: 1
            }
        },
        fileDataServerDataPathIndex: {
            fields: {
                dataServer: 1,
                dataPath: 1,
                fileName: 1
            }
        },
        fileTs: {
            fields: {
                ts: 1
            }
        },
        file_syncId: {
            fields: {
                _syncId: 1
            }
        },
        fileStepTagFileNameIndex: {
            fields: {
                stepTag: 1,
                fileName: 1
            }
        },
    }
};

let cls = Class.create(def);

export default {
    def, cls
}