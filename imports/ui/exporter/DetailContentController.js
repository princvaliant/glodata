import Toast from  '../applib/classic/base/Toast';
import  '../applib/store/MeteorStore';

Ext.define('exporter.DetailContentController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.exporterdetailcontent',
    constructor: function () {
        this.callParent(arguments);
    },
    init: function () {
        let self = this;
        let reload = Ext.Function.createBuffered (_reload, 10);
        Meteor.call('exporterVarGridDef', (err, result) => {
            let grid = self.getView().down('grid');
            let store = Ext.create('applib.store.Meteor', {
                remoteSort: false,
                remoteFilter: false,
                fields: result.fields,
                proxy: {
                    type: 'meteor',
                    actionMethods: {
                        'read': 'exporterVarList',
                        'update': 'exporterVarUpdate',
                        'destroy': 'exporterVarDestroy'
                    },
                    extraParams: {
                        exporterId: self.getView().config.exporterId,
                        ctg: self.getView().config.ctg
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
            let typeColumn = _.find(result.columns, {dataIndex: 'type'});
            typeColumn.renderer = function(value) {
                return '<div title="' + value + '" class="' + Settings.typeIcons[value] + '"/>';
            };
            let linkColumn = _.find(result.columns, {dataIndex: 'link'});
            linkColumn.renderer = function(value, row) {
                let d = row.record.data;
                let l = self.getViewModel().get('exporter').links;
                let mids = _.map(l, 'masterId');
                let lids = _.map(l, 'linkedId');
                let all = _.union(mids, lids);
                if (_.indexOf(all, d._id) !== -1){
                    return '<div title="' + value + '" class="fa fa-link di"/>';
                }
            };
            if (Meteor.user().username === this.getView().config.exporter.owner) {
                result.columns.push({
                    menuDisabled: true,
                    sortable: false,
                    xtype: 'actioncolumn',
                    width: 20,
                    items: ['@remove']
                });
            }
            let state = Ext.state.Manager.getProvider().state[grid.stateId];
            grid.reconfigure(store, result.columns);
            if (state) {
                grid.applyState(state);
            }
            reload(store);
        });


        let tree = self.getView().down('treepanel');
        let store = Ext.create('Ext.data.TreeStore', {
            folderSort: true,
            autoLoad: true,
            asynchronousLoad: true,
            proxy: {
                type: 'meteor',
                actionMethods: {
                    'read': 'variableTree'
                },
                extraParams: {
                    ctg: self.getView().config.ctg
                }
            },
            listeners: {
                exception: function (error) {
                    Toast.error(error.reason, error.error);
                }
            }
        });
        tree.reconfigure(store);
    },

    onRemoveClick: function(grid, rowIndex) {
        let rec = grid.getStore().getAt(rowIndex);
        Ext.MessageBox.confirm(Lang.t('general.deletetitle'), Lang.t('general.deleteconfirm'), function (btn) {
            if (btn === 'yes') {
                grid.store.remove(rec);
            }
        }, this);
    },

    onBeforeSelect: function(cmp, td, cellIndex, record) {
        let grid = this.getView().down('grid');
        let columns = grid.getColumnManager().getColumns();
        if (Meteor.user().username !== this.getView().config.exporter.owner) {
            _.each(columns, (column) => {
                column.setEditor(null);
            });
        }
        let filterCol = columns[5];
        filterCol.getEditor().getStore().loadData(Settings.exporterFilters[record.data.type]);
        return true;
    },

    onBeforeGridDrop: function (node, data, overModel, dropRec) {
        // If drag was variable from tree or grid reorder
        if (Meteor.user().username !== this.getView().config.exporter.owner) {
            return false;
        }
        if (data && data.records[0] && data.records[0].data.type !== undefined ||
            data.records[0].data.iconCls === undefined) {
            return true;
        }
        return false;
    },

    onGridDrop: function (node, data, dropRec, dropPosition) {
        let self = this;
        let dropId = dropRec ? dropRec.data._id : null
        let info = data.records[0].data;
        if (info.exporterId === undefined) {
            info.exporterId = this.getView().config.exporterId;
            info.idx = 0;
            Meteor.call('exporterVarCreate',
                info,
                dropId,
                dropPosition, (error) => {
                if (error) {
                    Toast.error(error.reason, error.error);
                } else {
                    self.getView().down('grid').store.load();
                }
            });
        } else {
            Meteor.call('exporterVarReorder',
                self.getView().config.ctg,
                self.getView().config.exporterId,
                dropId,
                info._id, dropPosition, (error) => {
                if (error) {
                    Toast.error(error.reason, error.error);
                } else {
                    self.getView().down('grid').store.load();
                }
            });
        }
    },

    onSearchVariablesChanged: function (cmp, newValue) {
        let tree = this.getView().down('treepanel');
        tree.store.proxy.extraParams = {ctg: this.getView().config.ctg, search: newValue};
        tree.store.reload();
    }
});

function _reload(store) {
    store.load();
}