Ext.define('genealogy.Controller', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.genealogy',
    init: function(view) {
        this.vm = this.getViewModel();
    }
});