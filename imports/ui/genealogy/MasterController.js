import Toast from  '../applib/classic/base/Toast';

Ext.define('genealogy.MasterController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.genealogymaster',
    constructor: function () {
        this.callParent(arguments);
        this.bufferedInit = Ext.Function.createBuffered(_initList, 300);
        this.bufferedSearch = Ext.Function.createBuffered(_search, 300);
        this.filter = {};
    },

    onListSearchChanged: function (cmp, newValue) {
        this.filter['search'] = newValue;
        this.bufferedSearch(this);
    },

    onListCtgChanged: function (cmp, newValue) {
        let list = this.lookupReference('genealogymasterlist');
        list.stateId =  'visualizermasterliststateid' + newValue;
        this.filter['tag'] = newValue;
        this.bufferedInit(this);
    },

    onListSelectionChange: function (cmp, newValue) {
        if (newValue && newValue.length > 0) {
            let grid = this.getView().down('genealogymastergrid');
            grid.getSelectionModel().deselectAll();
            grid.getSelectionModel().clearSelections();
            grid.store.getProxy().extraParams = {search: newValue[0].data.idss[0]};
            grid.store.load();
        }
    },

    onGridSelectionChange: function (cmp, newValue) {
        let view = this.getView().down('genealogymasterview');
        let ids = _.map(newValue, (o) => {
           return o.data._id;
        });
        view.removeAll(true);
        if (ids.length > 0) {
            Meteor.call('genealogyViewData', {_id: {$in: ids}}, (error, result) => {
                if (error) {
                    Toast.error(error.reason, error.error);
                } else {
                    view.add({
                        xtype: 'genealogymasterfields',
                        items: _.map(result, (dc) => {
                            return {
                                xtype: 'propertygrid',
                                title:  moment(dc.ts).format('MM/DD/YYYY hh:mm') + ' ' + dc.wc + ' ' + dc.step,
                                width: 350,
                                nameColumnWidth: 200,
                                source: dc.vars,
                                viewConfig: {
                                    enableTextSelection: true
                                },
                                listeners: {
                                    afterrender: function(grid) {
                                        grid.findPlugin('cellediting').disable();
                                    }
                                }
                            }
                        })
                    });
                }
            });
        }
    }
});

function _initList(cntrl) {
    let list = cntrl.lookupReference('genealogymasterlist');
    Meteor.call('genealogyListDef', this.filter.tag, (err, result) => {
        let store = Ext.create('Ext.data.BufferedStore', {
            fields: result.fields,
            autoLoad: false,
            remoteSort: true,
            pageSize: 100,
            trailingBufferZone: 100,
            leadingBufferZone: 100,
            purgePageCount: 20,
            proxy: {
                type: 'meteor',
                actionMethods: {
                    'read': 'genealogyList'
                },
                extraParams: self.filter
            },
            listeners: {
                exception: function (error) {
                    Toast.error(error.reason, error.error);
                }
            }
        });
        list.reconfigure(store, result.columns);
        let state = Ext.state.Manager.getProvider().state[list.stateId];
        if (state) {
             list.applyState(state);
        }
        cntrl.filter = {
            search: cntrl.lookupReference('genealogysearchlist').value,
            tag: cntrl.lookupReference('genealogyctgfilter').value
        };
        _search(cntrl);
    });

    let grid = cntrl.getView().down('genealogymastergrid');
    Meteor.call('genealogyGridDef', (err, result) => {
        let store = Ext.create('Ext.data.BufferedStore', {
            fields: result.fields,
            autoLoad: false,
            remoteSort: true,
            pageSize: 100,
            trailingBufferZone: 100,
            leadingBufferZone: 100,
            purgePageCount: 20,
            proxy: {
                type: 'meteor',
                actionMethods: {
                    'read': 'genealogyGridData'
                },
                extraParams: null
            },
            listeners: {
                exception: function (error) {
                    Toast.error(error.reason, error.error);
                }
            }
        });
        grid.reconfigure(store, result.columns);
        let state = Ext.state.Manager.getProvider().state[grid.stateId];
        if (state) {
            grid.applyState(state);
        }
    });
}

function _search(cntrl) {
    let grid = cntrl.getView().down('genealogymasterlist');
    grid.store.getProxy().extraParams = cntrl.filter;
    grid.store.load();
}