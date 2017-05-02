import varApi from '../domain/variable.api';
import unitApi from '../scoop/unit.api';
import dcApi from '../scoop/dc.api';
import variableToGridDef from '../util/variableToGridDef';
import Dc from '../../model/scoop/dc';
import astroToGridDef from '../util/astroToGridDef';

Meteor.methods({

    genealogyList: function (filter, options) {
        return unitApi.getList(filter, options);
    },

    genealogyListDef: function (ctg) {
        let vars = varApi.getVariablesByStep(ctg, true);
        return {
            columns: variableToGridDef.toColumns(vars),
            fields: variableToGridDef.toFields(vars)
        };
    },

    genealogyGridData: function (filter, options) {
        return dcApi.getList(filter, options);
    },

    genealogyGridDef: function () {
        return {
            columns: astroToGridDef.toColumns(Dc.def),
            fields: astroToGridDef.toFields(Dc.def)
        };
    },

    genealogyViewData: function (query) {
        let data = Dcs.find(query).fetch();
        return data;
    }
});

