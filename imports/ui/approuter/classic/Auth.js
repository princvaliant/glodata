import './auth/Login';
import './auth/Register';
import './auth/Forgot';
import './auth/Reset';

Ext.define('approuter.classic.Auth', {
    extend: 'Ext.panel.Panel',
    xtype: 'authpanel',
    controller: 'auth',
    layout: {
        type: 'card'
    },
    bodyCls: 'loginback',
    items: [{
        xtype: 'authlogin',
        reference: 'login'
    },{
        xtype: 'authregister',
        reference: 'register'
    },{
        xtype: 'authforgot',
        reference: 'forgot'
    },{
        xtype: 'authreset',
        reference: 'reset'
    }]
});
