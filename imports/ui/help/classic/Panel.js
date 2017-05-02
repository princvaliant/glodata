import '../Controller';
import '../ViewModel';

Ext.define('help.classic.Panel', {
    extend: 'approuter.classic.secure.Tab',
    xtype: 'helppanel',
    hierarchy: {
        TOP: 'helppanel',
        L0: '',
        L1: '',
        L2: ''
    },
    config: {
        initData: function (value) {

        }
    },
    onRender: function () {

        console.log('Help render');

        this.callParent();
    }
});