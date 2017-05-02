import StepTag from '../../model/domain/stepTag';

export default {
    upsert: function (dirname, active) {
        let name = Settings.stepTagDir(dirname);
        let stepTagModel = StepTag.cls.findOne({name: name});
        if (stepTagModel)  return stepTagModel;
        stepTagModel = new StepTag.cls();
        stepTagModel.name = name;
        stepTagModel.active = active;
        return StepTag.cls.findOne({_id: stepTagModel.save()});
    },
    listCtgs: function () {
        return StepTags.aggregate([{
            $match: {
                active: true
            }
        }, {
            $group: {
                _id: '$ctg',
                count: {$sum: 1}
            }
        }]);
    },
    activeSteps: function () {
        return _.map(StepTags.find({
                active: true
            }).fetch(), (o) => {
                return o.name;
        });
    },
    treeCtgs: function (filter) {
        let match = {};
        let expanded = false;
        if (filter.search) {
            match = {'$or': [
                {ctg: {$regex: '^' + filter.search.toLowerCase().trim()}},
                {wc: {$regex: '^' + filter.search.toLowerCase().trim()}},
                {step: {$regex: '^' + filter.search.toLowerCase().trim()}}
                ]};
            expanded = true;
        }
        match.active = true;

        let ret = StepTags.aggregate([{
            $match: match
        }, {
            $sort: {
                ctg: 1,
                wc: 1,
                step: 1
            }
        }, {
            $group: {
                _id:{
                    ctg: '$ctg',
                    wc: '$wc'
                },
                children: {
                    $push: {
                        id: '$_id',
                        qtip: '$name',
                        text: '$step',
                        ctg: '$ctg',
                        wc: '$wc',
                        step: '$step',
                        iconCls: 'fa fa-paw di',
                        leaf: true
                    }
                }
            }
        }, {
            $group: {
                _id: '$_id.ctg',
                text: {
                    $last: '$_id.ctg',
                },
                iconCls: {
                    $last: 'fa fa-cube di'
                },
                expanded: {
                    $last: true
                },
                ctg: {
                    $last: '$_id.ctg'
                },
                wc: {
                    $last: null
                },
                step: {
                    $last: null
                },
                children: {
                    $push: {
                        text: '$_id.wc',
                        ctg: '$_id.ctg',
                        wc: '$_id.wc',
                        step: null,
                        iconCls: 'fa fa-wrench di',
                        expanded: expanded,
                        children: '$children',
                        leaf: false
                    }
                }
            }
        }]);
        return ret;
    }
}