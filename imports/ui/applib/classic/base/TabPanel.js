
Ext.define('applib.classic.base.TabPanel', {
    extend: 'Ext.tab.Panel',
    xtype: 'basetabpanel',
    flex: 1,
    defaults: {
        bodyPadding: 0,
        bodyMargin: 0,
        border: false,
        layout: 'fit'
    },
    headerPosition: 'top',
    tabRotation: 'default',
    titleRotation: 'default',
    titleAlign: 'default',
    iconAlign: 'default',
    activeTab: null
});
