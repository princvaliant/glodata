import '../ViewModel';
import '../Controller';
import '../MasterViewModel';
import '../MasterController';
import './master/Grid';
import './master/View';
import './Detail';


Ext.define('exporter.classic.Master', {
    extend: 'Ext.panel.Panel',
    xtype: 'exportermaster',
    controller: 'exportermaster',
    viewModel: {
        type: 'exportermaster'
    },
    stateful: true,
    stateId: 'exportermasterstateid',
    layout:  'border',
    initComponent: function () {
        this.callParent();
        this.enableBubble('route');
    },
    items: [
        {
            xtype: 'exportermastergrid',
            reference: 'exportermastergrid',
            region: 'center'

        }, {
            xtype: 'exportermasterview',
            reference: 'exportermasterview',
            region: 'east',
            width: 400,
            header: false,
            collapsible: true,
            split: {
                size: 8
            }
        }
    ]
});