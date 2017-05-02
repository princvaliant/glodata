Ext.define('variables.MasterController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.variablesmaster',
    constructor: function () {
        this.callParent(arguments);
        this.bufferedSearch = Ext.Function.createBuffered (_search, 300);
        this.filter = {};
    },
    init: function () {
        let self = this;
        let tree = self.getView().down('treepanel');
        let store = Ext.create('Ext.data.TreeStore', {
            folderSort: true,
            autoLoad: true,
            asynchronousLoad: true,
            proxy: {
                type: 'meteor',
                actionMethods: {
                    'read': 'ctgTree'
                },
                extraParams: {}
            },
            listeners: {
                exception: function (error) {
                    Toast.error(error.reason, error.error);
                }
            }
        });
        tree.reconfigure(store);

        Meteor.call('variableGridDef', (err, result) => {
            let grid = self.getView().down('grid');
            let store = Ext.create('applib.store.Meteor', {
                remoteSort: true,
                remoteFilter: false,
                fields: result.fields,
                proxy: {
                    type: 'meteor',
                    actionMethods: {
                        'read': 'variableList',
                        'create': 'variableCreate',
                        'update': 'variableUpdate',
                        'destroy': 'variableDestroy'
                    },
                    extraParams: {
                        search: ''
                    }
                },
                listeners: {
                    exception: function (error) {
                        if (error.error !== 404) {
                            Toast.error(error.reason, error.error);
                        }
                    }
                }
            });
            let state = Ext.state.Manager.getProvider().state[grid.stateId];
            grid.reconfigure(store, result.columns);
            if (state) {
                grid.applyState(state);
            }
            self.bufferedSearch(self);
        });
    },
    onTreeSearchChanged: function (cmp, newValue) {
        let tree = this.getView().down('treepanel');
        tree.store.proxy.extraParams = {search: newValue};
        tree.store.reload();
    },
    onTreeSelected: function (cmp, newValue) {
        this.filter.ctg = newValue[0].data.ctg;
        this.filter.wc = newValue[0].data.wc;
        this.filter.step = newValue[0].data.step;
        this.bufferedSearch(this);
    },
    onVariableSearchChanged: function (cmp, newValue) {
        this.filter.search = newValue;
        this.bufferedSearch(this);
    },
    onAddButton: function (btn) {
        let addWindow = Ext.create('variables.classic.AddForm');
        this.view.add(addWindow);
        addWindow.show();

    },
    onSaveNewFileMeta: function (btn) {
        let data = btn.up('form').getValues();
        let grid = this.getView().down('grid');
        grid.store.insert(0, data, (error) => {
            if (!error) {
                grid.getSelectionModel().select(0);
                let window = btn.up('window');
                window.destroy();
            }
        });
    },
    onDeleteButton: function () {
        Ext.MessageBox.confirm(Lang.t('general.deletetitle'), Lang.t('general.deleteconfirm'), function (btn) {
            if (btn === 'yes') {
                let current = this.getViewModel().get('activeFileMeta');
                let grid = this.getView().down('grid');
                grid.store.remove(current);
                grid.getSelectionModel().select(0);
            }
        }, this);
    },
    onSelectionChange: function (cmp, newValue) {

    }
});

function _search(cntrl) {
    let grid = cntrl.getView().down('grid');
    grid.store.getProxy().extraParams = cntrl.filter;
    grid.store.currentPage = 1;
    grid.store.load();
}