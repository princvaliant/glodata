import Dc from '../../model/scoop/dc';
import DataRole from '../domain/dataRole.api';


export default  {
    // Constructs and saves record in DC collection based on the file data
    save: function(uniqueQuery, file, stepTag, ids, meta, vars, syncId) {
        let isNew = true;
        if (!uniqueQuery) {
            uniqueQuery = {fileId: file._id};
        }
        let dc = Dc.cls.findOne(uniqueQuery);
        if (!dc) {
            dc = new Dc.cls();
        } else {
            isNew = false;
        }
        dc._syncId = syncId || null;
        dc.ts = file.ts;
        dc.fileId = file._id;
        dc.ctg = stepTag.ctg;
        dc.wc = stepTag.wc;
        dc.step = stepTag.step;
        dc.vars = vars;
        dc.ids = ids;
        dc.meta = meta;
        if (isNew) {
            return dc.save();
        }
        dc.save();
        return dc._id;
    },

    getList(filter, options) {
        if (!_.isEmpty(filter)) {
            let query = {$and: DataRole.roleFilter()};
            let fields = {wc: 1, step: 1, ts: 1};
            if (filter.search && filter.search.trim()) {
                query.$and.push({search: filter.search});
            }
            let count = Dcs.find(query, {fields: fields}).count();
            let data = Dcs.find(query, _.extend(options, {fields: fields})).fetch();
            return {
                total: count,
                data: data
            };
        }
    },
}