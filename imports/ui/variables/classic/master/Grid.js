import '../../../applib/classic/base/Grid';

Ext.define('variables.classic.Grid', {
    extend: 'applib.classic.base.Grid',
    xtype: 'variablesgrid',
    plugins: [{
        ptype: 'cellediting',
        clicksToEdit: 1
    }],
    bind: {
        selection: '{activeVariable}'
    },
    stateful: true,
    stateId: 'variablegridstateid',
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
            reference: 'variablesearch',
            stateId: 'variablesearchid',
            width: 175,
            emptyText: Lang.t('domain.variablesearchgrid'),
            enableKeyEvents: true,
            listeners: {
                change: 'onVariableSearchChanged'
            }
        }, '->']
        //     , {
        //     text: Lang.t('exporter.addbutton'),
        //     iconCls: 'fa fa-plus',
        //     listeners: {
        //         click: 'onAddButton'
        //     }
        // }, {
        //     text: Lang.t('exporter.deleteButton'),
        //     iconCls: 'fa fa-remove',
        //     bind: {
        //         disabled: '{!activeVariable}'
        //     },
        //     listeners: {
        //         click: 'onDeleteButton'
        //     }
        // }]
    }],
    bbar: {
        xtype: 'pagingtoolbar',
        displayInfo: true
    }
});