
Ext.define('domain.MasterController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.domainmaster',
    constructor: function () {
        this.callParent(arguments);
    },
    onTabChange: function(tabPanel, newCard) {
       //  this.fireViewEvent('route', 2, {
       //      target: newCard.items.items[0].xtype,
       //      id: newCard.title,
       //      name: newCard.title}
       // );
    }
});
