Ext.define('help.Controller', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.help',
    control: {
        button: {
            //   click: 'onAnyButtonClick'
        }
    },
    init: function(view) {
        this.vm = this.getViewModel();
    },
    afterRender: function(view) {

    },

    clicked: function(btn) {
       this.fireViewEvent('route', 2, 'exporterdetail=2222');
    }
});