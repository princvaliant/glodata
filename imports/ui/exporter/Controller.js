import './MasterController';

Ext.define('exporter.Controller', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.exporter',
    init: function(view) {
        this.vm = this.getViewModel();
    }
});