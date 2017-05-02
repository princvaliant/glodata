Ext.define('visualizer.Controller', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.visualizer',
    init: function(view) {
        this.vm = this.getViewModel();
    }
});