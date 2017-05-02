import ExporterVar from '../../model/exporter/exporterVar';
import expApi from './exporter.api';
import astroToGridDef from '../util/astroToGridDef';

Meteor.methods({
    exporterVarList: function (filter, options) {
        if (!_.isEmpty(filter)) {
            let count = ExporterVars.find(filter).count();
            let data = ExporterVars.find(filter, options || {}).fetch();
            return {
                total: count,
                data: data
            };
        }
    },
    exporterVarUpdate: function (record) {
        expApi.isFilterValid(record);
        let cls = ExporterVar.cls.findOne({_id: record._id});
        if (record.id) {
            delete record.id;
        }
        cls.set(record);
        cls.save();
        return ExporterVars.findOne(record._id);
    },
    exporterVarCreate: function (record, dropId, pos) {
        let ret = new ExporterVar.cls(record).save();
        _reorder(record.ctg, record.exporterId, dropId, ret, pos);
        return true;
    },
    exporterVarReorder: function (ctg, exporterId, dropId, dragId, pos) {
       _reorder(ctg, exporterId, dropId, dragId, pos);
    },
    exporterVarDestroy: function (record) {
        if (record && record._id) {
            ExporterVars.remove(record._id);
        }
    },
    exporterVarRemoveByExporterCtg: function (exporterId, ctg) {
        if (exporterId && ctg) {
            Exporters.update({_id: exporterId}, {$pull: { links: { ctg: ctg }}});
            ExporterVars.remove({exporterId: exporterId, ctg: ctg});
        }
        return Exporters.findOne(exporterId);
    },
    exporterVarGridDef: function () {
        return {
            columns: astroToGridDef.toColumns(ExporterVar.def, Meteor.user().username),
            fields: astroToGridDef.toFields(ExporterVar.def)
        };
    }
});

function _reorder(ctg, exporterId, dropId, dragId, pos) {
    let expVars = ExporterVars.find({exporterId: exporterId, ctg: ctg}, {sort: {idx:1}}).fetch();
    let map = new Map();
    _.each(expVars, (expVar) => {
        if (expVar._id === dropId && pos === 'before') {
            map.set(dragId, map.size);
            map.set(expVar._id, map.size);
        } else if (expVar._id === dropId && pos === 'after') {
            map.set(expVar._id, map.size);
            map.set(dragId, map.size);
        } else if (expVar._id != dragId){
            map.set(expVar._id, map.size);
        }
    });
    map.forEach((idx, _id) => {
        ExporterVars.update({_id: _id}, {$set: {idx: idx}});
    });
}