import '../model/scoop/dc';
import Unit from '../model/scoop/unit';
import varApi from '../api/domain/variable.api';
import Observer from '../api/util/syncer.class';


// Subscribe to DC collection changes
Meteor.startup(function () {
    let observer = new Observer(Dcs, {
        _syncId: null
    }, {
        sort: {
            ts: 1
        }
    }, _process);
    observer.listen();
});

function _process(dc) {
    // First find all unit for this dc
    let query = {$or: []};
    _.each(dc.ids, (idd) => {
        if (idd === null || idd === undefined || idd.toString().trim() === '') {} else {
            query.$or.push({idss: idd.toString().toLowerCase(), tags: dc.ctg.toLowerCase()})
        }
    });
    if (query.$or.length === 0) {
        throw new Meteor.Error(404, 'Object does not contain identifier');
    }

    // Find unit where ids contain this idd
    let unitToSave;
    let units = Unit.cls.find(query).fetch();
    if (units.length > 1) {
        // If there are more then one unit merge all units into 0ne
        unitToSave = new Unit.cls();
        units.forEach((unit) => {
            unitToSave.ids = _.extend(unitToSave.ids || {}, unit.ids);
            unitToSave.meta = _.extend(unitToSave.meta || {}, unit.meta);
            unitToSave.steps = _.extend(unitToSave.steps || {}, unit.steps);
        });
        Unit.cls.remove(query);
    } else if (units.length === 0) {
        unitToSave = new Unit.cls();
        unitToSave.ids = {};
        unitToSave.meta = {};
        unitToSave.steps = {};
    } else {
        unitToSave = units[0];
    }
    let path = dc.ctg + '__' + dc.wc + '__' + dc.step;
    // If unit record has latest record then processing dc ignore it
    if (unitToSave.steps &&
        unitToSave.steps[path] &&
        unitToSave.steps[path]._ts &&
        unitToSave.steps[path]._ts > dc.ts) {
        return;
    }
    unitToSave.ts = dc.ts;
    unitToSave.parentId = dc.parentId;
    let ids = {};
    for (let field in dc.ids) {
        if (dc.ids.hasOwnProperty(field) && dc.ids[field]) {
            unitToSave.ids[varApi.getVariableName(field)] = dc.ids[field];
            ids[varApi.getVariableName(field)] = dc.ids[field];
        }
    }
    let meta = {};
    for (let field in dc.meta) {
        if (dc.meta.hasOwnProperty(field)) {
            if (dc.meta[field] === null || dc.meta[field] === undefined) {} else {
                unitToSave.meta[varApi.getVariableName(field)] = dc.meta[field];
                meta[varApi.getVariableName(field)] = dc.meta[field];
            }
        }
    }
    unitToSave.steps[path] = {};
    for (let field in dc.vars) {
        let varName = varApi.getVariableName(field);
        if (dc.vars.hasOwnProperty(field) && varName)  {
            unitToSave.steps[path][varName] = dc.vars[field];
        }
    }

    Dcs.update({_id: dc._id}, {
        $set: {
            vars: unitToSave.steps[path],
            ids: ids,
            meta: meta
        }
    });

    unitToSave.steps[path]._dc = dc._id;
    unitToSave.steps[path]._ts = dc.ts;
    unitToSave.save();

    varApi.insertVariableForDc(dc);
}
