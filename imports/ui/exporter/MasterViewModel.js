import '../applib/proxy/MeteorProxy';

Ext.define('exporter.MasterViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.exportermaster',
    data: {
        activeExporter: null,
        disableDelete: true
    }
    // ,
    // formulas: {
    //     fields: {
    //         get: function (get) {
    //             return get('_fields');
    //         },
    //
    //         set: function (value) {
    //             this.set(_fields, value);
    //         }
    //     }
    // }

    // autoLoad: true,
    // autoSync: true,
    // remoteSort: true,
    // remoteFilter: true,
    // pageSize: 25,
    // fields: result.fields,
    // proxy: {
    //     type: 'meteor',
    //     useSubscription: false,
    //     actionMethods: {
    //         'read': 'exporterList',
    //         'update': 'exporterUpdate',
    //         'create': 'exporterCreate',
    //         'destroy': 'exporterDestroy'
    //     },
    //     extraParams: {
    //         name: 'AlexTestsssddddd'
    //     }
    // }

        // Can not use update, delete, insert of models in store
        // Can not use subscription

        // Ext.create('Ext.data.BufferedStore', {
        //     autoLoad: true,
        //     autoSync: true,
        //     remoteSort: true,
        //     remoteFilter: true,
        //     pageSize: 100,
        //     trailingBufferZone: 100,
        //     leadingBufferZone: 100,
        //     purgePageCount: 20,
        //     fields: ['_id', 'title', 'userId'],
        //     proxy: {
        //         type: 'meteor',
        //         useSubscription: true,
        //         actionMethods: {
        //             'read': 'report',
        //             'update': 'update_report',
        //             'create': 'insert_report',
        //             'destroy': 'remove_report'
        //         }
        //     }
        // })

});