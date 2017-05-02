import '../../model/scoop/unit';
import varApi from '../domain/variable.api';
import unitApi from '../scoop/unit.api';

export default {
    getData: function (exporter, usrId) {
        let t0 = new Date().getTime();

        // Retrieve data for master link
        let master = _getDataPerPage(exporter._id, exporter.links[0].ctg, usrId);
        for (let i = 1; i < exporter.links.length; i++) {
            let link =  exporter.links[i];
            if (link.type === 'Left join') {
                let mid = ExporterVars.findOne({_id: link.masterId});
                let smid = new Set();
                _.each(master, (o) => {
                    smid.add(o[mid.title]);
                });
                let lid = ExporterVars.findOne({_id: link.linkedId});
                let linked = _getDataPerPage(exporter._id, link.ctg, usrId, lid, [...smid]);
                master = _merge(master, mid.title, linked, lid.title);
            }
        }

        let t1 = new Date().getTime();

        // Update statistics
        Exporters.update({_id: exporter._id}, {
            $set: {
                lastRunAt: new Date(),
                runTime: (t1 - t0)/1000
            },
            $inc: {
                runs: 1
            }
        });
        return master;
    },
    saveData: function (exporter, content) {
        Exporters.update({_id: exporter._id}, {$set: {excelTemplate: content}});
    },
    isFilterValid: function(exporterVar) {
        _createFilter([exporterVar]);
    }
}

function _getDataPerPage(exporterId, ctg, usrId, lid, linked) {

    let expvars = ExporterVars.find({exporterId, ctg}, {sort: {idx: 1}}).fetch();
    // Construct query and field selections for units table
    let fields = new Map();
    let q3 = new Set();
    let q2 = new Set();
    let q1 = new Set();
    let group = _.groupBy(expvars, (expvar) => {
        let tag = 1;
        if (expvar.wc) tag += 1;
        if (expvar.step) tag += 1;
        return tag.toString();
    });
    _.each(group['3'], (expvar) => {
        q3.add(expvar.ctg + '__' + expvar.wc + '__' + expvar.step);
        q2.add(expvar.ctg + '__' + expvar.wc);
        q1.add(expvar.ctg);
    });
    _.each(group['2'], (expvar) => {
        let path = expvar.ctg + '__' + expvar.wc;
        if (!q2.has(path)) {
            q3.add(path);
        }
        q1.add(expvar.ctg);
    });
    _.each(group['1'], (expvar) => {
        let path = expvar.ctg;
        if (!q1.has(path)) {
            q3.add(path);
        }
    });
    let query = {$and: [{tags: {'$in': [...q3].sort()}}]};
    let customFilters = _createFilter(expvars);
    if (customFilters) {
        query.$and = _.concat(query.$and, customFilters);
    }
    if (lid && linked) {
        query.$and.push ({[_fieldProjection(lid)]: {$in: linked}});
    }

    _.each(expvars, (expvar) => {
        // Create field selections
        fields.set(expvar.title, {$ifNull: ['$' + _fieldProjection(expvar), ' ']});
    });
    fields.set('_id', 0);
    return unitApi.getListForExport(query, fields, usrId);
}

function _merge(data1, f1, data2, f2) {
    let result = [];
    _.each(data1, (d1) => {
        let d2 = _.filter(data2, {[f2]: d1[f1]});
        if (d2 && d2.length > 0) {
            _.each(d2, (d) => {
                result.push(_.extend(d1, d));
            });
        } else {
            result.push(_.extend(d1));
        }
    });
    return result;
}

function _createFilter (expvars) {
    let filter = [];
    filter = _.union(filter, _processNumbers(_.filter(expvars, (o) => { return o.filter && (o.type === 'int' || o.type === 'float');})));
    filter = _.union(filter, _processDates(_.filter(expvars, (o) => { return o.filter && o.type === 'date'; })));
    filter = _.union(filter, _processStrings(_.filter(expvars, (o) => { return o.filter && o.type === 'string'; })));
    filter = _.union(filter, _processBoolean(_.filter(expvars, (o) => { return o.filter && o.type === 'boolean'; })));
    return filter;
}

function _processDates(list) {
    let ret = [];
    _.each(list, (o) => {
        let result = {};
        _.each(Settings.exporterFilters.date, (def) => {
            let match = o.filter.match(def.regex);
            if (match && match.length === 1 && match[0] === 'blank') {
                result = {'$or' : [
                    {[_fieldProjection(o)]: ''},
                    {[_fieldProjection(o)]: {'$type': 6}},
                    {[_fieldProjection(o)]: {'$type': 10}},
                    {[_fieldProjection(o)]: {'$exists': false}},
                    {[_fieldProjection(o)]: ' '},
                    {[_fieldProjection(o)]: '  '}
                ]};
            }
            if (match && match.length === 3 && match[0] === 'last ' &&  match[2] === ' days' &&
                varApi.getVariableType(match[1]) === 'int') {
                let from = moment().add(- parseFloat(match[1]), 'days');
                let to = moment().add(1, 'days');
                result[_fieldProjection(o)] = {
                    '$gte': from.toDate(),
                    '$lte': to.toDate()
                };
            }
            if (match && match.length === 3 && match[0] === 'next ' &&  match[2] === ' days' &&
                varApi.getVariableType(match[1]) === 'int') {
                let from = moment().add(-700, 'days');
                let to = moment().add(parseInt(match[1]), 'days');
                result[_fieldProjection(o)] = {
                    '$gte': from.toDate(),
                    '$lte': to.toDate()
                };
            }
            if (match && match.length === 3 &&  match[0] === 'between ' &&
                varApi.getVariableType(match[1]) === 'date' && varApi.getVariableType(match[2] === 'date')) {
                result[_fieldProjection(o)] = {
                    '$gte': varApi.getVariableValue(match[1]),
                    '$lte': varApi.getVariableValue(match[2])
                };
            }
        });
        if (_.isEmpty(result)) {
            throw new Meteor.Error(Lang.t('exporter.filtererrortitle'), Lang.t('exporter.filtererrormsg'));
        }
        ret.push(result);
    });
    return ret;
}

function _processStrings(list) {
    let ret = [];
    _.each(list, (o) => {
        let result = {};
        _.each(Settings.exporterFilters.string, (def) => {
            let match = o.filter.match(def.regex);
            if (match && match.length === 1 && match[0] === 'not blank') {
                result = {'$nor' : [
                    {[_fieldProjection(o)]: ''},
                    {[_fieldProjection(o)]: {'$type': 6}},
                    {[_fieldProjection(o)]: {'$type': 10}},
                    {[_fieldProjection(o)]: {'$exists': false}},
                    {[_fieldProjection(o)]: ' '},
                    {[_fieldProjection(o)]: '  '}
                ]};
            }
            if (match && match.length === 1 && match[0] === 'blank') {
                result = {'$or' : [
                    {[_fieldProjection(o)]: ''},
                    {[_fieldProjection(o)]: {'$type': 6}},
                    {[_fieldProjection(o)]: {'$type': 10}},
                    {[_fieldProjection(o)]: {'$exists': false}},
                    {[_fieldProjection(o)]: ' '},
                    {[_fieldProjection(o)]: '  '}
                ]};
            }
            if (match && match.length > 1 && match[0] === 'in ') {
                result = {[_fieldProjection(o)]: {'$in' : []}};
                for (let i = 1; i < match.length; i++) {
                    result[_fieldProjection(o)].$in.push(match[i]);
                }
            }
            if (match && match.length > 1 && match[0] === 'begin with ') {
                result = {'$or' : []};
                for (let i = 1; i < match.length; i++) {
                    result.$or.push( {[_fieldProjection(o)]: {$regex: '^' + match[i]}});
                }
            }
        });
        if (_.isEmpty(result)) {
            throw new Meteor.Error(Lang.t('exporter.filtererrortitle'), Lang.t('exporter.filtererrormsg'));
        }
        ret.push(result);
    });
    return ret;
}

function _processNumbers(list) {
    let ret = [];
    _.each(list, (o) => {
        let result = {};
        _.each(Settings.exporterFilters.int, (def) => {
            let match = o.filter.match(def.regex);
            if (match && match.length === 1 && match[0] === 'blank') {
                result = {'$or' : [
                    {[_fieldProjection(o)]: ''},
                    {[_fieldProjection(o)]: {'$type': 6}},
                    {[_fieldProjection(o)]: {'$type': 10}},
                    {[_fieldProjection(o)]: {'$exists': false}},
                    {[_fieldProjection(o)]: ' '},
                    {[_fieldProjection(o)]: '  '}
                ]};
            }
            if (match && def.expected === 1 && match.length === def.expected + 1 &&
                (varApi.getVariableType(match[1]) === 'int' || varApi.getVariableType(match[1]) === 'float')) {
                result[_fieldProjection(o)] = {[def.mongo[0]]: Number.parseFloat(match[1])};
            }
            if (match && def.expected === 2 &&  match.length === def.expected + 1 &&
                (varApi.getVariableType(match[1]) === 'int' || varApi.getVariableType(match[1]) === 'float') &&
                (varApi.getVariableType(match[2]) === 'int' || varApi.getVariableType(match[2]) === 'float')) {
                result[_fieldProjection(o)] = {
                    [def.mongo[0]]: Number.parseFloat(match[1]),
                    [def.mongo[1]]: Number.parseFloat(match[2])
                };
            }
        });
        if (_.isEmpty(result)) {
            throw new Meteor.Error(Lang.t('exporter.filtererrortitle'), Lang.t('exporter.filtererrormsg'));
        }
        ret.push(result);
    });
    return ret;
}

function _processBoolean(list) {
    let ret = [];
    _.each(list, (o) => {
        let result = {};
        _.each(Settings.exporterFilters.string, (def) => {
            let match = o.filter.match(def.regex);
            if (match && match.length === 1 && match[0] === 'true') {
                result = {[_fieldProjection(o)]: true};
            }
            if (match && match.length === 1 && match[0] === 'false') {
                result = {[_fieldProjection(o)]: {$in: [false, null]}};
            }
        });
        if (_.isEmpty(result)) {
            throw new Meteor.Error(Lang.t('exporter.filtererrortitle'), Lang.t('exporter.filtererrormsg'));
        }
        ret.push(result);
    });
    return ret;
}

function _fieldProjection(expvar) {
    if (!expvar.wc && !expvar.step) {
        return 'ids.' + expvar.name;
    } else if (!expvar.step) {
        return 'meta.' + expvar.name;
    } else {
        let key = expvar.ctg + '__' + expvar.wc + '__' + expvar.step;
        return 'steps.' + key + '.' +  expvar.name;
    }
}