Ext.define('approuter.classic.auth.Register', {
    extend: 'Ext.container.Container',
    xtype: 'authregister',
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
            title: Lang.t('register.title'),
            bodyPadding: 20,
            items: [{
                items: [{
                    xtype: 'textfield',
                    vtype: 'email',
                    fieldLabel: Lang.t('register.email'),
                    name: 'email'

                }, {
                    xtype: 'textfield',
                    inputType: 'password',
                    fieldLabel: Lang.t('register.password'),
                    name: 'password',
                    allowBlank: false
                }, {
                    xtype: 'textfield',
                    inputType: 'password',
                    fieldLabel: Lang.t('register.verify'),
                    name: 'verify',
                    allowBlank: false
                }],
                buttons: [{
                    text: Lang.t('register.button'),
                    formBind: true,
                    listeners: {
                        click: 'onRegisterClick'
                    }
                }]
            }]
        }, {
            xtype: 'box',
            margin: '0 20 20 20',
            autoEl: {
                tag: 'a',
                href: '#:auth:login',
                html: Lang.t('register.login')
            }
        }]
    }
});
