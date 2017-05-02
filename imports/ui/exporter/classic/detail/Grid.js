import '../../../applib/classic/base/Grid';

Ext.define('exporter.classic.detail.Grid', {
    extend: 'applib.classic.base.Grid',
    xtype: 'exporterdetailgrid',
    stateful: true,
    stateId: 'exporterdetailcontentstateid',
    multiSelect: false,
    autoScroll: true,
    viewConfig: {
        plugins: {
            ptype: 'gridviewdragdrop',
            containerScroll: true,
            dragText: 'Drag and drop to reorganize',
            ddGroup: 'exporterTreeToGridDD'
        },
        forceFit: true,
        preserveScrollOnRefresh: true,
        enableTextSelection: false
    },
    plugins: [{
        ptype: 'cellediting',
        clicksToEdit: 1
    }],
    actions: {
        remove: {
            iconCls: 'fa fa-remove',
            tooltip: Lang.t('exporter.deletebutton'),
            handler: 'onRemoveClick'
        }
    },
    listeners: {
        beforedrop: 'onBeforeGridDrop',
        drop: 'onGridDrop',
        cellclick: 'onBeforeSelect',

    }
});