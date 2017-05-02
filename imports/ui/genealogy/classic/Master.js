import '../ViewModel';
import '../Controller';
import '../MasterViewModel';
import '../MasterController';
import './master/List';
import './master/Grid';
import './master/View';
import './master/Fields';

Ext.define('genealogy.classic.Master', {
    extend: 'Ext.panel.Panel',
    xtype: 'genealogymaster',
    controller: 'genealogymaster',
    viewModel: {
        type: 'genealogymaster'
    },
    stateful: true,
    stateId: 'genealogymasterstateid',
    layout: 'border',
    initComponent: function () {
        this.callParent();
        this.enableBubble('route');
    },
    items: [{
        xtype: 'container',
        layout: 'fit',
        stateful: true,
        stateId: 'genealogymasterlistparentstateid',
        items: {
            xtype: 'genealogymasterlist',
            reference: 'genealogymasterlist',
        },
        region: 'west',
        width: 240,
        split: {
            size: 8
        },
        header: false,
        collapsible: true,
        scrollable: true
    }, {
        xtype: 'container',
        region: 'center',
        layout: 'border',
        stateful: true,
        stateId: 'genealogymaster2stateid',
        items: [{
            xtype: 'panel',
            region: 'west',
            layout: 'fit',
            width: 350,
            header: false,
            collapsible: false,
            scrollable: true,
            stateful: true,
            stateId: 'genealogymaster3stateid',
            split: {
                size: 8
            }, items: {
                xtype: 'genealogymastergrid',
                reference: 'genealogymastergrid'
            }
        }, {
            xtype: 'genealogymasterview',
            reference: 'genealogymasterview',
            region: 'center'
        }]
    }]
});