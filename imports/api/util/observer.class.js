// Observer class

export default class {

    constructor(collection, query, options) {
        this.syncId = process.pid.toString();
        this.collection = collection;
        this.query = query;
        this.options = options;
        this.boundDoc = new Meteor.EnvironmentVariable;
    }

    listen(callback) {
        if (process.env.ENABLE_JOBS !== 'true') {
            return;
        }
        let self = this;
        Meteor.setTimeout(function () {
            self.callback = callback;
            self.handle = self.collection.find(self.query, self.options);
            self.handle.observe({
                added: function (doc) {
                    self._prepare(doc, 'added');
                },
                changed: function (doc) {
                    self._prepare(doc, 'changed');
                }
            });
        }, 20000 + Math.random() * 10000);
    }

    _prepare(doc, action) {
        let self = this;
        self.boundDoc.withValue(doc, function () {
            let boundFunction = Meteor.bindEnvironment(function () {
                let d = self.boundDoc.get();
                self.callback(d);
            });
            self.collection.update({_id: doc._id, _syncId: null}, {$set: {_syncId: self.syncId}}, (error, n) => {
                if (error) {
                    self._log(doc, {message: error.error}, 'u');
                } else if (n === 1) {
                    try {
                        Meteor.setTimeout(boundFunction, Math.floor(Math.random() * 1000));
                    } catch (exc) {
                        self._log(doc, exc, action[0]);
                    }
                    doc = null;
                }
            });
        });
    }

    _log(doc, exception, event) {
        Log.err('observer', exception.message, exception.toString(), {
            event: event,
            collection: this.collection._name,
            docId: doc._id,
            syncId: this.syncId,
            query: this.query,
            options: this.options
        });
    }
}
