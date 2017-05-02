import DataRole from  '../../model/domain/dataRole';
import astroToGridDef from '../util/astroToGridDef';

Meteor.methods({
    dataRoleList: function (filter, options) {
        let query = {};
        if (filter.search) {
            query = {$and: []};
            _.each(filter.search.split(' '), (srch) => {
                if (!_.isEmpty(srch.trim())) {
                    query.$and.push({name: {$regex: srch.trim().toUpperCase()}})
                }
            });
        }
        let data = DataRoles.find(query, options || {}).fetch();
        return {
            total: DataRoles.find(query).count(),
            data: data
        };
    },
    dataRoleCreate: function (records) {
        let rec = records[0];
        rec.name = rec.name.toUpperCase();
        let cls = new DataRole.cls(rec);
        return [DataRoles.findOne(cls.save())];
    },
    dataRoleUpdate: function (record) {
        let cls = DataRole.cls.findOne({_id: record._id});
        if (record.id) {
            delete record.id;
        }
        cls.set(record);
        cls.save();
        return DataRoles.findOne(record._id);
    },
    dataRoleDestroy: function (record) {
        DataRoles.remove(record._id);
    },
    dataRoleGridDef: function () {
        return {
            columns: astroToGridDef.toColumns(DataRole.def),
            fields: astroToGridDef.toFields(DataRole.def)
        };
    }
});
