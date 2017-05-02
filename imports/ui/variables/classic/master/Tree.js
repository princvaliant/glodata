
Ext.define('variables.classic.Tree', {
    extend: 'Ext.panel.Panel',
    xtype: 'variablestree',
    stateful: true,
    stateId: 'variablestreestateid',
    layout: 'fit',
    dockedItems: [{
        xtype: 'toolbar',
        overflowHandler: 'scroller',
        items: [{
            xtype: 'textfield',
            stateful: true,
            stateId: 'domainvariablesearchstateid',
            reference: 'domainvariablesearchtree',
            width: '100%',
            emptyText: Lang.t('domain.variablesearchtree'),
            enableKeyEvents: true,
            listeners: {
                change: {
                    buffer: 300,
                    fn: 'onTreeSearchChanged'
                }
            }
        }]
    }],
    items: [{
        xtype: 'treepanel',
        scroll: 'both',
        autoScroll:true,
        rootVisible: false,
        useArrows: false,
        multiSelect: false,
        listeners: {
            selectionchange: {
                buffer: 300,
                fn: 'onTreeSelected'
            }
        }
    }]
});