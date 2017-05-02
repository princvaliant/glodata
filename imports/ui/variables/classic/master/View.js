Ext.define('variables.classic.View', {
    extend: 'Ext.panel.Panel',
    xtype: 'variablesview',
    stateful: true,
    stateId: 'variablesviewstateid',
    title: Lang.t('domain.variableviewtitle'),
    layout: {
        type: 'vbox',
        align: 'stretch'
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
        }]
    }],
    items: [{
        xtype: 'fieldset',
        title: Lang.t('general.information'),
        reference: 'exportermasterviewform',
        collapsible: false,
        margin:  '0 5 0 5',
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