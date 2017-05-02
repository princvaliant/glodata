Ext.define('applib.classic.base.Dialog', {
    extend: 'Ext.Window',
    xtype: 'basedialog',
    x: 280,
    y: 100,
    closable: true,
    plain: false,
    modal: true,
    layout: 'fit',
    session: true,
    items: {}
});