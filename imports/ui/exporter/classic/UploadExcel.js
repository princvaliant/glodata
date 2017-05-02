Ext.define('exporter.classic.UploadExcel', {
    extend: 'Ext.window.Window',
    xtype: 'exporteruploadexcel',
    reference: 'exporteruploadexcelwindow',
    width: 400,
    title: Lang.t('exporter.exceltemplate'),
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
            xtype: 'filefield',
            emptyText: Lang.t('exporter.emptyexceltext'),
            id: 'exporterexcelfileuploadtemplate',
            fieldLabel: Lang.t('exporter.excellabel'),
            name: 'filePath',
            buttonText: '',
            allowBlank: false,
            anchor: '100%',
            buttonConfig: {
                text: '',
                iconCls: 'fa fa-file-excel-o'
            },
            listeners: {
                afterrender: 'onFileFieldAfterRender'
            }
        }]
    }
});