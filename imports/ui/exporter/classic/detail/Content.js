import '../../DetailContentController';
import './Variable';
import './Grid';

Ext.define('exporter.classic.detail.Content', {
    extend: 'Ext.panel.Panel',
    xtype: 'exporterdetailcontent',
    controller: 'exporterdetailcontent',
    stateful: true,
    stateId: 'exporterdetailscontentstateid',
    layout: 'border',
    tabConfig: {
        listeners: {
            beforeclose: 'onBeforeClose'
        }
    },
    items: [{
            xtype: 'exporterdetailgrid',
            region: 'center'
        }, {
            xtype: 'exporterdetailvariable',
            region: 'east',
            header: false,
            title: Lang.t('general.variables'),
            width: 400,
            collapsible: true,
            scrollable: true,
            split: {
                size: 8
            }
        }
    ]
});