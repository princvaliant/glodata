import '../../../applib/classic/base/Grid';

Ext.define('domain.classic.fileMeta.Grid', {
    extend: 'applib.classic.base.Grid',
    xtype: 'domainfilemetagrid',
    plugins: [{
        ptype: 'cellediting',
        clicksToEdit: 1
    }],
    bind: {
        selection: '{activeFileMeta}'
    },
    stateful: true,
    stateId: 'domainfilemetagridstateid',
    modelValidation: true,
    multiSelect: false,
    listeners: {
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
            emptyText: Lang.t('domain.filemetasearch'),
            enableKeyEvents: true,
            listeners: {
                change: 'onSearchChanged'
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
                disabled: '{!activeFileMeta}'
            },
            listeners: {
                click: 'onDuplicateButton'
            }
        }, {
            text: Lang.t('exporter.deleteButton'),
            iconCls: 'fa fa-remove',
            bind: {
                disabled: '{!activeFileMeta}'
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