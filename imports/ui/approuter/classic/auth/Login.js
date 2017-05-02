Ext.define('approuter.classic.auth.Login', {
    extend: 'Ext.container.Container',
    xtype: 'authlogin',
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
            title: Lang.t('login.title'),
            bodyPadding: 20,
            items: [{
                xtype: 'textfield',
                name: 'email',
                fieldLabel: Lang.t('register.username'),
                allowBlank: false,
                listeners: {
                    specialKey: 'enterKey'
                },
            }, {
                xtype: 'textfield',
                name: 'password',
                inputType: 'password',
                fieldLabel: Lang.t('login.password'),
                allowBlank: false,
                listeners: {
                    specialKey: 'enterKey'
                }
            }],
            buttons: [{
                text: Lang.t('login.login'),
                formBind: true,
                listeners: {
                    click: 'onLoginClick'
                }
            }]
        }, {
            xtype: 'box',
            margin: '10 20 0 20',
            autoEl: {
                tag: 'a',
                href: '#:auth:register',
                html: Lang.t('login.register')
            }
        }, {
            xtype: 'box',
            margin: '10 20 10 20',
            autoEl: {
                tag: 'a',
                href: '#:auth:forgot',
                html: Lang.t('login.forgot')
            }
        }]
    }
});
