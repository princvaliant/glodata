import Graph from  '../../model/scoop/graph';

export default  {
    // Constructs and saves record in GRAPH collection based on the file data and attaches it to DC record
    save: function(dcId, idx, stepTag, pts) {
        let isNew = false;
        let graph = Graph.cls.findOne({dcId: dcId, idx: idx});
        if (!graph) {
            graph = new Graph.cls();
            graph.pts = {};
            isNew = true;
        }
        graph.dcId = dcId;
        graph.idx = idx;
        graph.stepTag = stepTag;
        graph.pts = _.extend(graph.pts, pts);
        if (isNew) {
            return graph.save();
        }
        graph.save();
        return graph._id;
    }
}