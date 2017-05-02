import stepTagApi from './stepTag.api';

Meteor.methods({
    ctgList: function () {
        let data = stepTagApi.listCtgs();
        return {
            total: data.length,
            data: data
        };
    },
    ctgTree: function (filter) {
        return stepTagApi.treeCtgs(filter);
    }
});