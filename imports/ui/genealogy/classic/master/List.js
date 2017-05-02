

Ext.define('genealogy.classic.master.List', {
    extend: 'applib.classic.base.Grid',
    xtype: 'genealogymasterlist',
    bind: {
        selection: '{activeUnit}'
    },
    multiSelect: false,
    stateful: true,
    stateId: 'genealogymasterliststateid',
    listeners: {
        selectionchange: 'onListSelectionChange'
    },
    dockedItems: [{
        xtype: 'toolbar',
        overflowHandler: 'scroller',
        items: [{
            xtype: 'combobox',
            name: 'ctg',
            reference: 'genealogyctgfilter',
            stateful: true,
            stateId: 'genealogyctgfilterid',
            emptyText: Lang.t('exporter.filterctg'),
            displayField: '_id',
            valueField: '_id',
            width: '59%',
            selectedIndex: 0,
            store: Ext.create('Ext.data.Store', {
                autoLoad: true,
                remoteFilter: true,
                fields: ['_id'],
                proxy: {
                    type: 'meteor',
                    actionMethods: {
                        'read': 'ctgList'
                    }
                }
            }),
            listConfig: {
                cls: 'min-row-height'
            },
            editable: false,
            queryMode: 'remote',
            anchor: '-15',
            listeners: {
                change: {
                    fn: 'onListCtgChanged',
                    buffer: 200
                }
            }
        }, {
            xtype: 'textfield',
            stateful: true,
            stateId: 'genealogysearchliststateid',
            reference: 'genealogysearchlist',
            width: '39%',
            emptyText: Lang.t('visualizer.searchunits'),
            enableKeyEvents: true,
            listeners: {
                change: {
                    buffer: 300,
                    fn: 'onListSearchChanged'
                }
            }
        }]
    }]
});
