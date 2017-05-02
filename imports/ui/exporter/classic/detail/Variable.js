import Toast from  '../../../applib/classic/base/Toast';

Ext.define('exporter.classic.detail.Variable', {
    extend: 'Ext.panel.Panel',
    xtype: 'exporterdetailvariable',
    stateful: true,
    stateId: 'exporterdetailvariablestateid',
    dockedItems: [{
        xtype: 'toolbar',
        overflowHandler: 'scroller',
        items: [{
            xtype: 'textfield',
            stateful: false,
            reference: 'exportersearchvariables',
            width: '100%',
            emptyText: Lang.t('exporter.searchtextvariables'),
            enableKeyEvents: true,
            listeners: {
                change: {
                    buffer: 300,
                    fn: 'onSearchVariablesChanged'
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
        viewConfig: {
            plugins: {
                ptype: 'treeviewdragdrop',
                ddGroup : 'exporterTreeToGridDD',
                copy: true,
                enableDrop: false
            }
        }
    }]
});