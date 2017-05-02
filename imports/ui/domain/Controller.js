Ext.define('domain.Controller', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.domain',
    init: function(view) {
        this.vm = this.getViewModel();
    }
});