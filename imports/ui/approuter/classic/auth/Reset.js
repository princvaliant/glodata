Ext.define('approuter.classic.auth.Reset', {
    extend: 'Ext.container.Container',
    xtype: 'authreset',
    layout: 'center',
    items: {
        xtype: 'panel',
        border: true,
        layout: {
            type: 'vbox',
            pack: 'start',
            align: 'stretch'
        },
        items: [{
            xtype: 'form',
            title: Lang.t('reset.title'),
            bodyPadding: 20,
            items: [{
                items: [{
                    xtype: 'textfield',
                    name: 'password',
                    inputType: 'password',
                    fieldLabel: Lang.t('reset.password'),
                    allowBlank: false
                }],
                buttons: [{
                    text: Lang.t('reset.button'),
                    formBind: true,
                    listeners: {
                        click: 'onResetClick'
                    }
                }]
            }]
        }]
    }
});
