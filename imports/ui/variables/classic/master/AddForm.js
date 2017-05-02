

Ext.define('variables.classic.AddForm', {
    extend: 'Ext.window.Window',
    xtype: 'variablesaddform',
    width: 400,
    title: Lang.t('domain.variableadd'),
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
            xtype: 'textfield',
            name: 'server',
            fieldLabel: Lang.t('general.server'),
        },{
            xtype: 'textfield',
            name: 'path',
            fieldLabel: Lang.t('general.path'),
        }],
        buttons: [{
            text: Lang.t('general.btnsave'),
            disabled: true,
            formBind: true,
            handler: 'onSaveNewVariable'
        }]
    }
});