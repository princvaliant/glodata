Ext.define('exporter.classic.master.View', {
    extend: 'Ext.panel.Panel',
    xtype: 'exportermasterview',
    stateful: true,
    stateId: 'exportermasterviewstateid',
    title: Lang.t('exporter.masterviewtitle'),
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    listeners: {
        afterRender: 'onViewAfterRender'
    },
    scrollable: true,
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: ['->', {
            iconCls: 'fa fa-table',
            xtype: 'button',
            hidden: true,
            text: Lang.t('general.viewdata'),
            bind: {
                disabled: '{!activeExporter}'
            }
        }, {
            iconCls: 'fa fa-clipboard',
            id: 'exporterClipboardJmp',
            xtype: 'button',
            tooltip: Lang.t('exporter.copyurltoclipbaord'),
            text: 'JMP',
            bind: {
                disabled: '{!activeExporter}'
            }
        }, {
            iconCls: 'fa fa-download',
            xtype: 'button',
            text: Lang.t('general.iqyfile'),
            reference: 'exporterviewiqyfile',
            bind: {
                disabled: '{!activeExporter}'
            },
            handler: 'onIqyFile'
        }, {
            iconCls: 'fa fa-file-excel-o',
            xtype: 'button',
            text: Lang.t('general.excelexport'),
            bind: {
                disabled: '{!activeExporter}'
            },
            handler: 'onViewData'
        }]
    }],
    items: [{
        xtype: 'fieldset',
        title: Lang.t('general.information'),
        reference: 'exportermasterviewform',
        collapsible: false,
        margin: '0 5 0 5',
        defaults: {
            labelWidth: 120,
            anchor: '100%'
        }
    }, {
        xtype: 'fieldset',
        title: Lang.t('general.statistics'),
        collapsible: false,
        margin: '0 5 0 5',
        defaults: {
            labelWidth: 100,
            anchor: '100%'
        },
        items: [{
            xtype: 'displayfield',
            fieldLabel: Lang.t('general.createdAt'),
            renderer: Ext.util.Format.dateRenderer('m/d/y H:i'),
            bind: '{activeExporter.createdAt}'
        }, {
            xtype: 'displayfield',
            fieldLabel: Lang.t('general.updatedAt'),
            renderer: Ext.util.Format.dateRenderer('m/d/y H:i'),
            bind: '{activeExporter.updatedAt}'
        }, {
            xtype: 'displayfield',
            fieldLabel: Lang.t('exporter.lastRunAt'),
            renderer: Ext.util.Format.dateRenderer('m/d/y H:i'),
            bind: '{activeExporter.lastRunAt}'
        }, {
            xtype: 'displayfield',
            fieldLabel: Lang.t('exporter.runs'),
            bind: '{activeExporter.runs}'
        }, {
            xtype: 'displayfield',
            fieldLabel: Lang.t('exporter.runTime'),
            bind: '{activeExporter.runTime}'
        }]
    }]
});