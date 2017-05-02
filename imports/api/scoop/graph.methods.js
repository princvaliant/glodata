import '../../model/scoop/graph';
import '../../model/scoop/unit';

Meteor.methods({
    graphGetForUnit: function (unitId, tag, idx, options) {
        let fields = {fields: {['steps.' + tag]: 1}};
        let unit =  Units.findOne({_id: unitId},  fields || {});
        let dc = unit.steps[tag]._dc;
        return Graphs.findOne({dcId: dc, idx: idx}, options);
    }
});
