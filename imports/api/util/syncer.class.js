// Syncer class

export default class {

    constructor(collection, query, options, callback) {
        this.syncId = process.pid.toString();
        this.collection = collection;
        this.query = query;
        this.options = options;
        this.callback = callback;
    }

    listen() {
        if (process.env.ENABLE_JOBS !== 'true') {
            return;
        }
        try {
            this._prepare(this);
        }
        catch (exc) {
            this._log(this.query, exc, 'syncer|listen');
        }
    }

    _prepare(self) {
        let doc = self.collection.findOne(self.query, self.options);
        if (doc) {
            self.collection.update({_id: doc._id, _syncId: null}, {$set: {_syncId: self.syncId}}, (error, n) => {
                if (error) {
                    self._log(doc, {message: error.error}, 'syncer|update');
                } else if (n === 1) {
                    try {
                        self.callback(doc);
                    } catch (exc) {
                        self._log(doc, exc, 'syncer|parse');
                    }
                    doc = null;
                }
                Meteor.setTimeout(function() {self._prepare(self);}, Math.floor(Math.random() * 3000));
            });
        } else {
            Meteor.setTimeout(function() {self._prepare(self);}, 10000);
        }

    }

    _log(doc, exception, event) {
        Log.err('syncer', exception.message, exception.toString(), {
            event: event,
            collection: this.collection._name,
            docId: doc._id,
            syncId: this.syncId,
            query: this.query,
            options: this.options
        });
    }
}
