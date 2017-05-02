

Ext.define('applib.proxy.MeteorProxy', {
    extend: 'Ext.data.proxy.Server',
    alias: 'proxy.meteor',

    config: {
        // What are the server methods to be used to retrieve data
        // read method will contain subscription name if useSubscription = true
        actionMethods: {
            read: '',
            create: '',
            update: '',
            destroy: '',
            duplicate: ''
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
        let method = me.getMethod(operation);

        // apply JsonP proxy-specific attributes to the Request
        me.request.setConfig({
            method: method,
            timeout: me.timeout,
            scope: me,
            disableCaching: false// handled by the proxy
        });

        if (!method) {
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
            if (filters && filters.length > 0) {
                callParams = me.senchaFilterToMeteorFilter(filters);
            }
            let sorters = operation.getSorters();
            if (sorters) {
                options.sort = me.sortersToMeteorSorters(sorters);
            }
        }

        if (!me.subInProcess && action === 'read') {
            if (action === 'read') {
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

    processResponse: function (error, operation, request, response) {
        let me = this,
            exception, reader, resultSet, success;

        me.fireEvent('beginprocessresponse', me, response, operation);

        if (!error) {
            success = true;
            reader = me.getReader();
            if (!reader.getRootProperty() || reader.getRootProperty() === '') {
                reader.setRootProperty('data');
            } else {

            }
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
    }
});