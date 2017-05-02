import Variable from '../../model/domain/variable';
import varApi from './variable.api';
import astroToGridDef from '../util/astroToGridDef';

Meteor.methods({
    variableTree: function (filter) {
        return varApi.getTree(filter);
    },
    variableList: function (filter, options) {
        let query = { $and: [
            {ctg: filter.ctg},
            {wc: filter.wc || null},
            {step: filter.step || null}
        ]};
        if (filter.search) {
            _.each(filter.search.split(' '), (srch) => {
                if (!_.isEmpty(srch.trim())) {
                    query.$and.push({search: {$regex: '^' + srch.trim().toLowerCase()}})
                }
            });
        }
        return {
            total: Variables.find(query).count(),
            data:  Variables.find(query, options || {}).fetch()
        };
    },
    variableUpdate: function (record) {
        let cls = Variable.cls.findOne({_id: record._id});
        if (record.id) {
            delete record.id;
        }
        cls.set(record);
        cls.save();
        return Variables.findOne(record._id);
    },
    variableCreate: function (records) {
        let ret = [];
        _.each(records, function (record) {
            ret.push(new Variable.cls(record).save());
        });
        let retObj = _.map(ret, (o) => {
            return Variables.findOne(o);
        });
        return retObj;
    },
    variableDestroy: function (record) {
        Variables.remove(record._id);
    },
    variableGridDef: function () {
        return {
            columns: astroToGridDef.toColumns(Variable.def),
            fields: astroToGridDef.toFields(Variable.def)
        };
    }
});