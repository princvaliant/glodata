import '../../../applib/proxy/MeteorProxy';

Ext.define('exporter.classic.detail.LinkForm', {
    extend: 'Ext.window.Window',
    xtype: 'exporterdetaillinkform',
    width: 600,
    title: Lang.t('exporter.addlinks'),
    modal: true,
    layout: 'anchor',
    items: {
        xtype: 'form',
        margin: 7,
        defaults: {
            anchor: '100%'
        },
        items: [],
        buttons: [{
            text: Lang.t('general.btnsave'),
            disabled: true,
            formBind: true,
            handler: 'onLinkFormSave'
        }]
    }
});