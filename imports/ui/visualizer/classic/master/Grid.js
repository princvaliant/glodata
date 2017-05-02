import '../../../applib/classic/base/Grid';

Ext.define('visualizer.classic.master.Grid', {
    extend: 'applib.classic.base.Grid',
    xtype: 'visualizermastergrid',
    bind: {
        selection: '{activeUnit}'
    },
    stateful: true,
    stateId: 'visualizermastergridstateid',
    multiSelect: true,
    listeners: {
        selectionchange: 'onGridSelectionChange',
    },
    minWidth: 175,
    dockedItems: [{
        xtype: 'toolbar',
        overflowHandler: 'scroller',
        items: [{
            xtype: 'textfield',
            stateful: true,
            stateId: 'visualizersearchgridstateid',
            reference: 'visualizersearch',
            width: 175,
            emptyText: Lang.t('visualizer.searchunits'),
            enableKeyEvents: true,
            listeners: {
                change: 'onGridSearchChanged'
            }
        }]
    }]
});