import '../../applib/proxy/MeteorProxy';

Ext.define('exporter.classic.SelectCtg', {
    extend: 'Ext.window.Window',
    xtype: 'exporterselectctg',
    width: 400,
    title: Lang.t('exporter.selectctg'),
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
            store: Ext.create('Ext.data.ArrayStore', {
                autoLoad: true,
                fields: ['_id'],
                data: []
            }),
            editable: false,
            triggerAction: 'all',
            queryMode:'local'
        }],
        buttons: [{
            text: Lang.t('general.btnsave'),
            disabled: true,
            formBind: true,
            handler: 'onSelectCtg'
        }]
    }
});