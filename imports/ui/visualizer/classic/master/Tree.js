import Toast from  '../../../applib/classic/base/Toast';

Ext.define('visualizer.classic.detail.Tree', {
    extend: 'Ext.panel.Panel',
    xtype: 'visualizermastertree',
    layout: 'fit',
    stateful: true,
    stateId: 'visualizermastertreestateid',
    title: Lang.t('visualizer.mastertreetitle'),
    dockedItems: [{
        xtype: 'toolbar',
        overflowHandler: 'scroller',
        items: [{
            xtype: 'textfield',
            stateful: true,
            stateId: 'visualizersearchtreestateid',
            reference: 'visualizersearchtree',
            width: '100%',
            emptyText: Lang.t('visualizer.searchtexttree'),
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