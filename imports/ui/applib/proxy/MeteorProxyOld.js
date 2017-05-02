

Ext.define('applib.proxy.MeteorProxyOld', {
    extend: 'Ext.data.proxy.Server',
    alias: 'proxy.meteorold',

    config: {
        // If data from server will be retrieved using methods or subscription
        // Subscription should be used only for reactivity of small amount of data
        useSubscription: false,
        // What are the server methods to be used to retrieve data
        // read method will contain subscription name if useSubscription = true
        actionMethods: {
            read: '',
            create: '',
            update: '',
            destroy: ''
        }
    },

    buildUrl: function(request) {
        return 'dummy';
    },

    doRequest: function (operation) {
        //generate the unique IDs for this request
        let me = this;
        me.request = me.buildRequest(operation);
        let params = me.request.getParams();
        let action = me.request.getAction();
        let method = me.getMethod(me.request);

        // apply JsonP proxy-specific attributes to the Request
        me.request.setConfig({
            method: method,
            timeout: me.timeout,
            scope: me,
            disableCaching: false// handled by the proxy
        });

        if (!method) {
            me.setException(operation, 'Method not defined');
            me.fireEvent('exception', me, 'Method not defined', operation);
            return me.request;
        }

        let callParams = {};
        let options = {};
        if (action === 'read') {
            for (parm in params) {
                if (parm === 'limit') {
                    options.limit = params[parm];
                } else if (parm === 'start') {
                    options.skip = params[parm]
                } else if (parm !== 'page' && parm !== 'sort') {
                    callParams[parm] = params[parm];
                }
            }
            let filters = operation.getFilters();
            if (filters) {
                callParams = me.senchaFilterToMeteorFilter(filters);
            }
            let sorters = operation.getSorters();
            if (sorters) {
                options.sort = me.sortersToMeteorSorters(sorters);
            }

        } else if (action === 'update') {
            callParams = Ext.Array.map(me.request.getRecords(), function (obj) {
                me.updateInfo(obj.data);
                return obj.data;
            });
        } else if (action === 'create') {
            callParams = Ext.Array.map(me.request.getRecords(), function (obj) {
                obj.data._id = Meteor.hashid();
                me.insertInfo(obj.data);
                return obj.data;
            });
        } else if (action === 'destroy') {
            callParams = Ext.Array.map(me.request.getRecords(), function (obj) {
                return obj.data;
            });
        }

        if (!me.subInProcess) {
            if (action === 'read') {
                if (me.getUseSubscription() === true) {
                    me.subscribe(operation, method, callParams, options);
                } else {
                    me.call(operation, method, callParams, options);
                }
            } else {
                me.call(operation, method, callParams, options);
            }
        }

        // Set the params back once we have made the request though
        me.request.setParams(params);
        return me.request;
    },

    call(operation, method, callParams, options) {
        let me = this;
        Meteor.call(method, callParams, options, function (error, result) {
            me.processResponse(error, operation, me.request, result);
        });
    },

    subscribe(operation, method, callParams, options) {
        let me = this;
        let initializing = true;
        me.store = operation._internalScope;
        if (me.handle) {
            // This is subsequent read operation so Unsubscribe from existing publications
            if (me.dataHandle) me.dataHandle.stop();
            if (me.countHandle) me.countHandle.stop();
            me.handle.stop();
        } else {
            // If this is first read operation intiate or meteor collections
            me.countCollection = new Meteor.Collection(method + "_c");
            me.dataCollection = new Meteor.Collection(method + "_d");
        }

        // Subscribe to server data and start observing data changes
        me.handle = Meteor.subscribe(method, method, callParams, options, function () {

            let countCursor = me.countCollection.find();
            let dataCursor = me.dataCollection.find({}, {
                sort: options.sort
            });

            let data = {};
            data.data = dataCursor.fetch();
            data.total = countCursor.fetch()[0].total;
            me.processResponse(null, operation, me.request, data);

            me.countHandle = countCursor.observeChanges({
                changed: function (id, fields) {
                    if (!initializing) {
                        me.processSubscriptionEvents('total', operation, id, fields.count);
                    }
                }
            });

            me.dataHandle = dataCursor.observeChanges({
                added: function (id, record) {
                    record.id = record._id;
                    if (!initializing) {
                        me.processSubscriptionEvents('added', operation, id, record);
                    }
                },
                changed: function (id, record) {
                    record.id = id;
                    if (!initializing) {
                        me.processSubscriptionEvents('changed', operation, id, record);
                    }
                },
                removed: function (id) {
                    if (!initializing) {
                        me.processSubscriptionEvents('removed', operation, id);
                    }
                }
            });
            initializing = false;
        });
    },


    processResponse: function (error, operation, request, response) {
        let me = this,
            exception, reader, resultSet, success;

        me.fireEvent('beginprocessresponse', me, response, operation);

        if (!error) {
            success = true;
            reader = me.getReader();
            reader.setRootProperty('data');
            resultSet = reader.read(me.extractResponseData(response), {
                recordCreator: operation.getRecordCreator()
            });
            operation.process(resultSet, request, response);
            exception = !operation.wasSuccessful();
        } else {
            me.setException(operation, error, response);
            exception = true;
        }
        if (exception) {
            success = false;
            me.fireEvent('exception', me, response, operation);
        }
        me.afterRequest(request, success);
        me.fireEvent('endprocessresponse', me, response, operation);
    },

    processSubscriptionEvents: function (event, operation, id, record) {
        let me = this;
        me.subInProcess = true;

        let recs = operation.getRecords(),
            len = recs.length,
            rec = me.store.getById(id);

        if (event === 'changed') {
            if (rec) {
                rec.set(record);
            }
        }
        if (event === 'added') {
            record.id = id;
            record._id = id;
            me.store.insert(0, record);
        }
        if (event === 'removed') {
            if (rec) {
                me.store.remove(rec);
            }
        }
        if (event === 'total' && record) {
            me.store.totalCount = record;
        }

        me.subInProcess = false;
    },

    sortersToMeteorSorters: function (sorters) {
        let meteorSorters = {};
        Ext.Array.each(sorters, function (sorter) {
            let direction = !sorter._direction || sorter._direction == "ASC" ? 1 : -1;
            if (sorter._property && direction) {
                meteorSorters[sorter._property] =  direction;
            }
        });
        return meteorSorters;
    },

    senchaFilterToMeteorFilter: function (filters) {
        let meteorFilters = {};
        if (filters && filters.length) {
            Ext.Array.each(filters, function (filter) {
                let property = filter.getProperty(),
                    value = filter.getValue();
                meteorFilters[property] = value;
            });
        }
        return meteorFilters;
    },

    getMethod: function (request) {
        let actions = this.getActionMethods(),
            action = request.getAction(),
            method;

        if (actions) {
            method = actions[action];
        }
        return method;
    },

    setException: function (operation, error, response) {
        operation.setException({
            status: error.error,
            statusText: error.reason,
            response: response
        });
    },

    insertInfo: function (record) {
        delete record.id;
        record.createdAt = moment()._d;
    },

    updateInfo: function (record) {
        delete record.id;
        record.updatedAt = moment()._d;
    }

});