import parseHelper from '/imports/api/util/parseHelper';
import dcApi from '/imports/api/scoop/dc.api';
import graphApi from '/imports/api/scoop/graph.api';
import stepTagApi from '/imports/api/domain/stepTag.api';
import Observer from '/imports/api/util/syncer.class';
import '/imports/model/scoop/file';

if (Meteor.isServer) {
    // IMPORTANT: directory name for this widget matches CTG__WC__STEP format
    // Required call to register this step processor
    let stepTag = stepTagApi.upsert(__dirname, true);

    Meteor.startup(function () {
        // Create observer for inserted Files related to this step
        let observer = new Observer(Files, {
            stepTag: stepTag.name,
            _syncId: null
        }, {}, _processFile);
        // Observer starts listening
        observer.listen();
    });

    function _processFile(file) {
        let content = parseHelper.bytesToString(file.content);

        // let dcId = dcApi.save(
        //     null,
        //     file,
        //     stepTag,
        //     wid,
        //     _.extend({'lot_id': header['Lot ID']}, (file.meta || {})),
        //     _.extend(header, specs, stats)
        // );
        // if (dcId !== null) {
        //     graphApi.save(dcId, 0, stepTag.name, ptsWafer);
        // }
    }
}