import '../ViewModel';
import '../Controller';
import '../MasterViewModel';
import '../MasterController';
import './master/Tree';
import './master/Grid';
import './master/View';
import './master/Fields';

Ext.define('visualizer.classic.Master', {
    extend: 'Ext.panel.Panel',
    xtype: 'visualizermaster',
    reference: 'visualizermasterpanel',
    controller: 'visualizermaster',
    viewModel: {
        type: 'visualizermaster'
    },
    stateful: true,
    stateId: 'visualizermasterstateid',
    layout: {
        type: 'border'
    },
    initComponent: function () {
        this.callParent();
        this.enableBubble('route');
    },
    items: [{
        xtype: 'visualizermastertree',
        reference: 'visualizermastertree',
        region: 'west',
        width: 190,
        header: false,
        collapsible: true,
        split: {
            size: 8
        }
    }, {
        xtype: 'container',
        region: 'center',
        layout: 'border',
        stateful: true,
        stateId: 'visualizermaster2stateid',
        listeners: {
            // resize: function(cmp, w, h, wold, hold) {
            //    let view = cmp.down('visualizermasterview');
            //    view.setWidth(Math.ceil(view.width * w /wold));
            // }
        },
        items: [{
            xtype: 'panel',
            region: 'west',
            layout: 'fit',
            header: false,
            collapsible: false,
            scrollable: true,
            stateful: true,
            stateId: 'visualizermaster3stateid',
            split: {
                size: 8
            },
            width: 400,
            items: {
                xtype: 'visualizermastergrid',
                reference: 'visualizermastergrid'
            }
        }, {
            xtype: 'visualizermasterview',
            reference: 'visualizermasterview',
            region: 'center'
        }]
    }]
});