Ext.define('applib.classic.base.Grid', {
    extend: 'Ext.grid.Panel',
    xtype: 'basegrid',
    frame: false,
    collapsible: false,
    border: false,
    margins: '0 0 0 0',
    header: false,
    viewConfig: {
        trackOver: true,
        preserveScrollOnRefresh: true,
        enableTextSelection: true
    },
    selModel: {
        pruneRemoved: false
    },
    listeners: {
        beforestatesave: function (cmp, state) {
            if (Ext.isArray(state.columns) && state.columns.length === 0) {
                return false;
            }
            return true;
        }
    }
});