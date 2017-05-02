import '../../model/scoop/unit';
import unitApi from './unit.api';
import varApi from '../domain/variable.api';
import variableToGridDef from '../util/variableToGridDef';

Meteor.methods({
    unitCategoryTree: function (filter) {
        return unitApi.getTree(filter);
    },
    unitList: function (filter, options) {
        return unitApi.getList(filter, options);
    },
    unitGridDef: function (tag) {
        let vars = varApi.getVariablesByStep(tag, true);
        return {
            columns: variableToGridDef.toColumns(vars),
            fields: variableToGridDef.toFields(vars)
        };
    },
});
