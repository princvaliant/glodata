Ext.define('myaccount.Controller', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.myaccount',
    control: {
        button: {
            //   click: 'onAnyButtonClick'
        }
    },
    init: function(view) {
        this.vm = this.getViewModel();
    },
    afterRender: function(view) {
        console.log('sss');
    },

    clicked: function(btn) {
       this.fireViewEvent('route', 2, 'exporterdetail=2222');
    },

    onLogout: function() {
        Meteor.logout();
        this.redirectTo(':auth:login');
    }
});