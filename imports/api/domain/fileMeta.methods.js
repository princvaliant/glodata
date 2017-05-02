import FileMeta from '../../model/domain/fileMeta';
import astroToGridDef from '../util/astroToGridDef';

Meteor.methods({

    fileMetaList: function (filter, options) {
        let query = {};
        if (filter.search) {
            query = {$and: []};
            _.each(filter.search.split(' '), (srch) => {
                if (!_.isEmpty(srch.trim())) {
                    query.$and.push({search: {$regex: '^' + srch.trim().toLowerCase()}})
                }
            });
        }
        let data = FileMetas.find(query, options || {}).fetch();
        return {
            total: FileMetas.find(query).count(),
            data:  data
        };
    },
    fileMetaUpdate: function (record) {
        let cls = FileMeta.cls.findOne({_id: record._id});
        if (record.id) {
            delete record.id;
        }
        cls.set(record);
        cls.save();
        return FileMetas.findOne(record._id);
    },
    fileMetaCreate: function (records) {
        let ret = [];
        _.each(records, function (record) {
            ret.push(new FileMeta.cls(record).save());
        });
        let retObj = _.map(ret, (o) => {
            return FileMetas.findOne(o);
        });
        return retObj;
    },
    fileMetaDuplicate: function (record) {
        delete record._id;
        delete record.id;
        let newId = new FileMeta.cls(record).save();
        return FileMetas.findOne(newId);
    },
    fileMetaDestroy: function (record) {
        FileMetas.remove(record._id);
    },
    fileMetaGridDef: function () {
        return {
            columns: astroToGridDef.toColumns(FileMeta.def),
            fields: astroToGridDef.toFields(FileMeta.def)
        };
    }
});