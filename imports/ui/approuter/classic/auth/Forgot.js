Ext.define('approuter.classic.auth.Forgot', {
    extend: 'Ext.container.Container',
    xtype: 'authforgot',
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
            title: Lang.t('forgot.title'),
            bodyPadding: 20,
            items: [{
               items: [{
                    xtype: 'displayfield',
                    hideEmptyLabel: true,
                    value: Lang.t('forgot.text')
                }, {
                    xtype: 'textfield',
                    name: 'email',
                    fieldLabel: Lang.t('forgot.email'),
                    allowBlank: false
                }],
                buttons: [{
                    text: Lang.t('forgot.button'),
                    formBind: true,
                    listeners: {
                        click: 'onForgotClick'
                    }
                }]
            }]
        }, {
            xtype: 'box',
            margin: '0 20 20 20',
            autoEl: {
                tag: 'a',
                href: '#:auth:login',
                html: Lang.t('forgot.remember')
            }
        }]
    }
});
