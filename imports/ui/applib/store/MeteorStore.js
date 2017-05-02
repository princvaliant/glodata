import '../proxy/MeteorProxy';

Ext.define('applib.store.Meteor', {
    extend: 'Ext.data.Store',
    alias: 'store.meteor',
    autoLoad: false,
    autoSync: false,
    remoteGroup: false,
    remoteFilter: false,
    remoteSort: true,
    pageSize: 25,
    config: {
        proxy: {
            type: 'meteor'
        }
    },
    constructor: function() {
        this.callParent(arguments);
        this.bufferedUpdate = Ext.Function.createBuffered (_update, 300);
    },
    add: function(records, callback) {
        let self = this;
        let method =  this.getProxy().actionMethods.create;
        Meteor.call(method, _getData(records), function (error, result) {
            if (!error) {
                _.each(result, (rec) => {
                    self.superclass.add.call(self, rec);
                })
            } else {
                self.fireEvent('exception', error);
            }
            if (_.isFunction(callback)) {
                callback(error, result)
            }
        });
    },
    insert: function(index, records, callback) {
        let self = this;
        let method =  this.getProxy().actionMethods.create;
        Meteor.call(method, _getData(records), function (error, result) {
            if (!error) {
                _.each(result, (rec) => {
                    self.superclass.insert.call(self, index, rec);
                })
            } else {
                self.fireEvent('exception', error);
            }
            if (_.isFunction(callback)) {
                callback(error, result)
            }
        });
    },
    duplicate: function(record, callback) {
        let self = this;
        let method =  this.getProxy().actionMethods.duplicate;
        Meteor.call(method, record.data || record, function (error, result) {
            if (!error) {
                self.superclass.insert.call(self, 0, result);
            } else {
                self.fireEvent('exception', error);
            }
            if (_.isFunction(callback)) {
                callback(error, result)
            }
        });
    },
    remove: function(record, callback) {
        let self = this;
        let method =  this.getProxy().actionMethods.destroy;
        Meteor.call(method, record.data || record, function (error) {
            if (!error) {
                self.superclass.remove.call(self, record);
            } else {
                self.fireEvent('exception', error);
            }
            if (_.isFunction(callback)) {
                callback(error);
            }
        });
    },
    listeners: {
        update: function(store, record, opts) {
            if (opts === 'edit') {
                this.bufferedUpdate(record);
            }
        }
    }
});

function _update(record) {
    if (!record) return;
    let self = this;
    let method =  this.getProxy().actionMethods.update;
    Meteor.call(method, record.data || record, function (error, result) {
        if (!error) {
            record = result;
            self.commitChanges() ;
        } else {
            self.rejectChanges() ;
            self.fireEvent('exception', error);
        }
    });
}

function _getData(records) {
    let data = [];
    if (_.isArray(records) && records.length > 0) {
        data = _.map(records, (record) => {
            return record.data || record;
        });
    } else {
        data.push(records.data || records);
    }
    return data;
}