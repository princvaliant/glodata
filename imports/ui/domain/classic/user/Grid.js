import '../../../applib/classic/base/Grid';

Ext.define('domain.classic.user.Grid', {
    extend: 'applib.classic.base.Grid',
    xtype: 'domainusergrid',
    plugins: [{
        ptype: 'cellediting',
        clicksToEdit: 1
    }],
    bind: {
        selection: '{activeUser}'
    },
    stateful: true,
    stateId: 'domainusergridstateid',
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
            reference: 'usersearch',
            stateId: 'usersearchid',
            width: 175,
            emptyText: Lang.t('domain.usersearchgrid'),
            enableKeyEvents: true,
            listeners: {
                change: 'onUserSearchChanged'
            }
         }, '->', {
            text: Lang.t('exporter.deleteButton'),
            iconCls: 'fa fa-remove',
            bind: {
                disabled: '{!activeUser}'
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