

Ext.define('domain.classic.fileMeta.AddForm', {
    extend: 'Ext.window.Window',
    xtype: 'domainfilemetaaddform',
    width: 400,
    title: Lang.t('domain.filemetaadd'),
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
            name: 'crawlerServer',
            fieldLabel: Lang.t('general.crawlerserver'),
        }, {
            xtype: 'textfield',
            name: 'dataServer',
            fieldLabel: Lang.t('general.dataserver'),
        },{
            xtype: 'textfield',
            name: 'dataPath',
            fieldLabel: Lang.t('general.datapath'),
        }],
        buttons: [{
            text: Lang.t('general.btnsave'),
            disabled: true,
            formBind: true,
            handler: 'onSaveNewFileMeta'
        }]
    }
});