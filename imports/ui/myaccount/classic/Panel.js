import '../Controller';
import '../ViewModel';



Ext.define('myaccount.classic.Panel', {
    extend: 'Ext.panel.Panel',
    xtype: 'myaccountpanel',
    hierarchy: {
        TOP: 'myaccountpanel',
        L0: '',
        L1: '',
        L2: ''
    },
    layout: 'fit',
    items: [{
        xtype: 'button',
        text: Lang.t('login.logout'),
        handler: 'onLogout'
    }],
    config: {
        initData: function (value) {

        }
    },
    listeners: {
        afterrender: 'afterRender'
    }
});