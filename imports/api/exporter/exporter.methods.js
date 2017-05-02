import Exporter from '../../model/exporter/exporter';
import ExporterVar from '../../model/exporter/exporterVar';
import astroToGridDef from '../util/astroToGridDef';
import astroToFormDef from '../util/astroToFormDef';
import excel from '../util/excelHelper';
import expApi from './exporter.api';

Meteor.methods({

    exporterGet: function (id) {
        let exporter = Exporters.findOne(id);
        if (exporter === undefined) {
            throw new Meteor.Error('404', Lang.t('general.notfound'));
        }
        return exporter;
    },
    exporterList: function (filter, options) {
        if (!_.isEmpty(filter)) {
            let query = {$and: []};
            if (filter.search) {
                _.each(filter.search.split(' '), (srch) => {
                    if (!_.isEmpty(srch.trim())) {
                        query.$and.push({search: {$regex: '^' + srch.trim().toLowerCase()}})
                    }
                });
            } else {
                query.$and.push({search: {$ne: ''}})
            }
            if (filter.owner) {
                query.$and.push({owner: Meteor.user().username});
            }
            if (filter.ctg && filter.ctg.trim()) {
                query.$and.push({ctg: filter.ctg});
            }

            query.$and.push({$or:[{
                publish: true
            }, {
                owner: Meteor.user().username
            }]});

            let count = Exporters.find(query).count();
            let data = Exporters.find(query, options || {}).fetch();
            return {
                total: count,
                data: data
            };
        }
    },
    exporterUpdate: function (record) {
        let cls = Exporter.cls.findOne({_id: record._id});
        if (record.id) {
            delete record.id;
        }
        cls.set(record);
        cls.save();
        return Exporters.findOne(record._id);
    },
    exporterDuplicate: function (record) {
        let id = record._id;
        if (record.id) {
            delete record.id;
        }
        delete record._id;
        record.owner += Meteor.user().username;
        record.name += ' - COPY';
        record.lastRunAt = null;
        record.runs = 0;
        let newId = new Exporter.cls(record).save();
        // Duplicate exporter variables
        let expVars = ExporterVars.find({exporterId: id}).fetch();
        _.each(expVars, (expVar) => {
            delete expVar._id;
            expVar.exporterId = newId;
            expVar.owner = Meteor.user().username;
            new ExporterVar.cls(expVar).save();
        });
        // duplicate all records in variables
        return Exporters.findOne(newId);
    },
    exporterCreate: function (records) {
        let ret = [];
        _.each(records, function (record) {
            ret.push(new Exporter.cls(record).save());
        });
        let retObj = _.map(ret, (o) => {
            return Exporters.findOne(o);
        });
        return retObj;
    },
    exporterDestroy: function (record) {
        Exporters.remove(record._id);
        ExporterVars.remove({exporterId:record._id});
    },
    exporterGridDef: function () {
        return {
            columns: astroToGridDef.toColumns(Exporter.def),
            fields: astroToGridDef.toFields(Exporter.def)
        };
    },
    exporterFormDef: function (bindString, owner) {
        return {
            forms: astroToFormDef.toForm(Exporter.def, bindString, owner)
        };
    },
    exporterViewData: function (exporter) {
        let data = expApi.getData(exporter);
        let excelTemplate = Exporters.findOne(exporter._id).excelTemplate;
        return excel.toExcelWithTemplate(data, exporter, excelTemplate);
    },
    exxporterSaveExcelTemplate: function (exporter, content) {
        let data = expApi.saveData(exporter, content);
        return true;
    }
});