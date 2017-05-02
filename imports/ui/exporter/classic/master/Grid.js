import '../../../applib/classic/base/Grid';

Ext.define('exporter.classic.master.Grid', {
    extend: 'applib.classic.base.Grid',
    xtype: 'exportermastergrid',
    plugins: [{
        ptype: 'cellediting',
        clicksToEdit: 1
    }],
    bind: {
        selection: '{activeExporter}'
    },
    stateful: true,
    stateId: 'exportermastergridstateid',
    modelValidation: true,
    multiSelect: false,
    listeners: {
        rowdblclick: 'onRowDoubleClick',
        selectionchange: 'onSelectionChange',
    },
    dockedItems: [{
        xtype: 'toolbar',
        overflowHandler: 'scroller',
        items: [{
            xtype: 'textfield',
            stateful: true,
            reference: 'exportersearch',
            stateId: 'exportersearchid',
            width: 175,
            emptyText: Lang.t('exporter.searchtext'),
            enableKeyEvents: true,
            listeners: {
                change: 'onSearchChanged'
            }
        }, {
            xtype: 'combobox',
            name: 'ctg',
            reference: 'exportersctgfilter',
            stateful: true,
            stateId: 'exportersctgfilterid',
            emptyText: Lang.t('exporter.filterctg'),
            displayField: '_id',
            valueField: '_id',
            store: Ext.create('Ext.data.Store', {
                autoLoad: true,
                remoteFilter: true,
                fields: ['_id'],
                proxy: {
                    type: 'meteor',
                    actionMethods: {
                        'read': 'ctgList'
                    }
                },
                listeners: {
                    load: function (store) {
                        let rec = {_id: null, OBJECT_ID: null};
                        store.insert(0, rec);
                    }
                }
            }),
            listConfig: {
                cls: 'min-row-height'
            },
            minChars: 0,
            editable: false,
            queryMode: 'remote',
            anchor: '-15',
            listeners: {
                change: 'onCtgChanged'
            }
        }, {
            xtype: 'checkboxfield',
            boxLabel: Lang.t('exporter.onlymybox'),
            stateful: true,
            stateId: 'exportersonlymyfilterid',
            reference: 'exportersonlymyfilter',
            stateEvents: ['check', 'change'],
            getState: function () {
                return {"checked": this.getValue()};
            },
            applyState: function (state) {
                this.setValue(state.checked);
            },
            listeners: {
                change: 'onOwnerOnlyChanged'
            }
        }, '->', {
            text: Lang.t('exporter.addbutton'),
            iconCls: 'fa fa-plus',
            listeners: {
                click: 'onAddButton'
            }
        }, {
            text: Lang.t('exporter.duplicatebutton'),
            iconCls: 'fa fa-clone',
            bind: {
                disabled: '{activeExporter === null}'
            },
            listeners: {
                click: 'onDuplicateButton'
            }
        }, {
            text: Lang.t('exporter.deleteButton'),
            iconCls: 'fa fa-remove',
            bind: {
                disabled: '{disableDelete}'
            },
            listeners: {
                click: 'onDeleteButton'
            }
        }]
    }],
    bbar: {
        xtype: 'pagingtoolbar',
        displayInfo: true
    }
});