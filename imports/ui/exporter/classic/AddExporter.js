import '../../applib/proxy/MeteorProxy';

Ext.define('exporter.classic.AddExporter', {
    extend: 'Ext.window.Window',
    xtype: 'exporteraddexporter',
    width: 400,
    title: Lang.t('exporter.addexporter'),
    modal: true,
    layout: 'anchor',
    items: {
        xtype: 'form',
        margin: 7,
        defaults: {
            anchor: '-1',
            labelWidth: 120,
            allowBlank: false
        },
        items: [{
            xtype: 'combobox',
            name: 'ctg',
            fieldLabel: Lang.t('exporter.selectctg'),
            displayField: '_id',
            valueField: '_id',
            store: Ext.create('Ext.data.Store', {
                autoLoad: false,
                remoteFilter: true,
                fields: ['_id'],
                proxy: {
                    type: 'meteor',
                    actionMethods: {
                        'read': 'ctgList'
                    }
                }
            }),
            minChars: 0,
            editable: false,
            queryMode: 'remote'
        }, {
            xtype: 'textfield',
            name: 'name',
            fieldLabel: Lang.t('general.name'),
        }],
        buttons: [{
            text: Lang.t('general.btnsave'),
            disabled: true,
            formBind: true,
            handler: 'onSaveNewExporter'
        }]
    }
});