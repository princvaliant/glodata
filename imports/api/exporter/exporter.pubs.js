

Meteor.publish('report', function (collectionName, filter, options) {

    let self = this;
    let count = 0;
    let initializing = true;
    let handleCount = Reports.find(filter, {
        fields: {
            _id: 1
        }
    });
    handleCount.observeChanges({
        added: function (doc, idx) {
            count++;
            if (!initializing)
                self.changed(collectionName + "_c", "_id", {
                    count: count
                }); // "counts" is the published collection name
        },
        removed: function (doc, idx) {
            count--;
            self.changed(collectionName + "_c", "_id", {
                count: count
            }); // same published collection, "counts"
        }
    });
    initializing = false;
    self.added(collectionName + "_c", "_id", {
        total: count
    });
    let handleData = Reports.find(filter, options || {});
    handleData.observe({
        added: function (doc, idx) {
            doc.id = doc._id;
            self.added(collectionName + "_d", doc._id, doc);
        },
        changed: function (doc, idx) {
            doc.id = doc._id;
            self.changed(collectionName + "_d", doc._id, doc);
        },
        removed: function (doc) {
            self.removed(collectionName + "_d", doc._id);
        }
    });

    self.ready();
    self.onStop(function () {

    });
});