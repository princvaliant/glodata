Ext.define('domain.classic.user.View', {
    extend: 'Ext.panel.Panel',
    xtype: 'domainuserview',
    title: Lang.t('domain.selecteduser'),
    stateful: true,
    stateId: 'domainuserviewstateid',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    scrollable: true,
    items: [{
        xtype: 'fieldset',
        collapsible: false,
        border: false,
        margin: '20 5 0 5',
        defaults: {
            labelWidth: 120,
            width: 400
        },
        defaultType: 'textfield',
        items: [{
            fieldLabel: Lang.t('register.username'),
            name: 'username',
            allowBlank: false,
            bind: '{activeUser.username}'
        }, {
            fieldLabel: Lang.t('register.email'),
            allowBlank: false,
            name: 'email',
            bind: '{activeUser.email}'
        }, {
            fieldLabel: Lang.t('register.firstname'),
            name: 'first',
            bind: '{activeUser.first}'
        }, {
            fieldLabel: Lang.t('register.lastname'),
            name: 'last',
            bind: '{activeUser.last}'
        }, {
            fieldLabel: Lang.t('register.company'),
            name: 'company',
            bind: '{activeUser.company}'
        }, {
            xtype: 'checkboxfield',
            fieldLabel: Lang.t('register.verify'),
            name: 'verified',
            bind: '{activeUser.verified}'
        }]
    }, {
        xtype: 'panel',
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        items: [{
            xtype: 'propertygrid',
            reference: 'propertygridapproles',
            title: Lang.t('register.applicationroles'),
            margin: '20 5 0 5',
            nameColumnWidth: 170,
            flex: 1,
            listeners: {
                propertychange: 'onAppRolesPropertyChange',
            }
        }, {
            xtype: 'propertygrid',
            reference: 'propertygriddataroles',
            title: Lang.t('register.dataroles'),
            nameColumnWidth: '100%',
            margin: '20 5 0 5',
            flex: 1,
            listeners: {
                propertychange: 'onDataRolesPropertyChange'
            },
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop',
                    containerScroll: true,
                    dropGroup: 'datarole-dd-grid-to-grid-group',
                    dragGroup: 'userdatarole-dd-grid-to-grid-group',
                },
                listeners: {
                    drop: 'onAddUserDataRole'
                }
            }
        }]
    }]
});