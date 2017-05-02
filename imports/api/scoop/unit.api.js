import '../../model/scoop/unit';
import StepTag from '../domain/stepTag.api';
import DataRole from '../domain/dataRole.api';

export default {

    getTree: function (filter) {
        let match = {'$and': DataRole.roleFilter()};
        let search = filter.search ? filter.search.toLowerCase().trim() : '';
        if (search) {
            match.$and.push({tagss:  {$regex: '^' + search}});
        }
        match.$and.push({ts: {$gt: moment().add(-360, 'days').toDate()}});
        let ret = Units.aggregate([{
            $match: match
        }, {
            $project: {
                tags: '$tags'
            }
        }, {
            $unwind: '$tags'
        }, {
            $group: {
                _id: '$tags',
                cnt: {
                    $sum: 1
                }
            }
        }, {
            $project: {
                tags: '$_id',
                ctg: {$arrayElemAt: [{$slice: [{$split: ['$_id', '__']}, 0, 1]}, 0]},
                wcs: {$slice: [{$split: ['$_id', '__']}, 0, 2]},
                wc: {$arrayElemAt: [{$slice: [{$split: ['$_id', '__']}, 1, 1]}, 0]},
                step: {$arrayElemAt: [{$slice: [{$split: ['$_id', '__']}, 2, 1]}, 0]},
                lev: {$size: {$split: ['$_id', '__']}},
                cnt: '$cnt'
            }
        }, {
            $match: {
                tags: {$in: StepTag.activeSteps()},
                step: {
                    $ne: null
                },
                wc: {
                    $ne: null
                },
                $or: [
                    {ctg: {$regex: '^' + search}},
                    {wc: {$regex: '^' + search}},
                    {step: {$regex: '^' + search}},
                ]
            }
        }, {
            $sort: {
                'tags': 1
            }
        }, {
            $group: {
                _id: '$wcs',
                wc: {
                    $last: '$wc'
                },
                ctg: {
                    $last: '$ctg'
                },
                cnt: {
                    $sum: '$cnt'
                },
                children: {
                    $push: {
                        tag: '$step',
                        path: '$tags',
                        cnt: '$cnt',
                        iconCls: 'fa fa-paw di',
                        leaf: true
                    }
                }
            }
        }, {
            $group: {
                _id: '$ctg',
                tag: {
                    $last: '$ctg'
                },
                path: {
                    $last: '$ctg'
                },
                iconCls: {
                    $last: 'fa fa-cube di'
                },
                expanded: {
                    $last: true
                },
                cnt: {
                    $sum: '$cnt'
                },
                children: {
                    $push: {
                        tag: '$wc',
                        path: {
                            $concat: ['$ctg', '__', '$wc']
                        },
                        cnt: '$cnt',
                        iconCls: 'fa fa-wrench di',
                        expanded: search.length > 1,
                        children: '$children'
                    }
                }
            }
        }]);
        return ret;
    },

    getList(filter, options) {
        if (!_.isEmpty(filter)) {
            let query = {$and: DataRole.roleFilter()};
            let fields = {ids: 1, meta: 1, ts: 1};
            if (filter.tag && filter.tag.trim()) {
                query.$and.push({tags: filter.tag});
                let s = filter.tag.split('__');
                if (s.length === 3) {
                    fields['steps.' + filter.tag] = 1;
                }
            }
            if (filter.search) {
                _.each(filter.search.split(' '), (srch) => {
                    if (!_.isEmpty(srch.trim())) {
                        query.$and.push({search: {$regex: '^' + srch.trim().toLowerCase()}})
                    }
                });
            }
            let count = Units.find(query, {fields: {ts: 1}}).count();
            let data = Units.find(query, _.extend(options, {})).fetch();
            return {
                total: count,
                data: data
            };
        }
    },

    getListForExport(query, fields, userId) {
       query.$and = _.concat(DataRole.roleFilter(userId), query.$and);
       return Units.aggregate([{
            $match: query
        }, {
            $project: fields
        }]);
    }
}
