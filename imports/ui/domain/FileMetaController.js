import Toast from  '../applib/classic/base/Toast';

Ext.define('domain.FileMetaController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.domainfilemeta',
    constructor: function () {
        this.callParent(arguments);
        this.bufferedSearch = Ext.Function.createBuffered (_search, 300);
        this.filter = {};
    },
    init: function () {
        let self = this;
        Meteor.call('fileMetaGridDef', (err, result) => {
            let grid = self.getView().down('grid');
            let store = Ext.create('applib.store.Meteor', {
                remoteSort: false,
                remoteFilter: false,
                fields: result.fields,
                proxy: {
                    type: 'meteor',
                    actionMethods: {
                        'read': 'fileMetaList',
                        'create': 'fileMetaCreate',
                        'update': 'fileMetaUpdate',
                        'destroy': 'fileMetaDestroy',
                        'duplicate': 'fileMetaDuplicate'
                    },
                    extraParams: {
                        search: ''
                    }
                },
                listeners: {
                    exception: function (error) {
                        Toast.error(error.reason, error.error);
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
    onSelectionChange: function (cmp, selected, eOpts) {

    },
    onAddButton: function (btn) {
        let addWindow = Ext.create('domain.classic.fileMeta.AddForm');
        this.view.add(addWindow);
        addWindow.show();

    },
    onDuplicateButton: function () {
        let grid = this.getView().down('grid');
        grid.store.duplicate(this.getViewModel().get('activeFileMeta'), (error) => {
            if (!error) {
                grid.getSelectionModel().select(0);
            }
        });
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
    onSearchChanged: function (cmp, newValue) {
        this.filter.search = newValue;
        this.bufferedSearch(this);
    }
});

function _search(cntrl) {
    let grid = cntrl.getView().down('grid');
    grid.store.getProxy().extraParams = cntrl.filter;
    grid.store.currentPage = 1;
    grid.store.load();
}