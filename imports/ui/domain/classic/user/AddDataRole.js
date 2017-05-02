

Ext.define('domain.classic.user.AddDataRole', {
    extend: 'Ext.window.Window',
    xtype: 'useradddatarole',
    width: 400,
    title: Lang.t('domain.adddatarole'),
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
            name: 'name',
            fieldStyle: 'text-transform:uppercase',
            fieldLabel: Lang.t('general.name')
        }, {
            xtype: 'textfield',
            name: 'ruleTags',
            fieldLabel: Lang.t('domain.ruletag'),
            allowBlank: true
        }, {
            xtype: 'textfield',
            name: 'ruleFilter',
            fieldLabel: Lang.t('domain.rulefilter'),
            allowBlank: true
        }],
        buttons: [{
            text: Lang.t('general.btnsave'),
            disabled: true,
            formBind: true,
            handler: 'onDataRoleSaveButton'
        }]
    }
});