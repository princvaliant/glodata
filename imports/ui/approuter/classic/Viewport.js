import './Auth';
import './Public';
import './Secure';
import './PageNotFound';


Ext.define('approuter.classic.Viewport', {
    extend: 'Ext.container.Viewport',
    xtype: 'routerview',
    layout: 'card',
    controller: 'router',
    constructor: function () {
        this.callParent();
    },
    items: [{
        xtype: 'authpanel',
        reference: 'auth'
    }, {
        xtype: 'publicpanel',
        reference: 'public'
    }, {
        xtype: 'securepanel',
        reference: 'secure'
    }, {
        xtype: 'pagenotfound',
        reference: 'pagenotfound'
    }]
});
