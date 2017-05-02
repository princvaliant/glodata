Ext.define('variables.Controller', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.variables',
    init: function(view) {
        this.vm = this.getViewModel();
    }
});