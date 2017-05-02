
import '../DetailController';
import '../DetailViewModel';
import '../../applib/classic/base/TabPanel';
import './detail/Content';

Ext.define('exporter.classic.Detail', {
    extend: 'applib.classic.base.TabPanel',
    xtype: 'exporterdetail',
    controller: 'exporterdetail',
    viewModel: {
        type: 'exporterdetail'
    },
    stateful: true,
    stateId: 'exporterdetailid',
    tabPosition: 'left',
    tabRotation: 'default',
    defaults: {
        closable: true,
        border: false
    },
    layout: "fit",
    config: {
        initData: function (id) {
            this.fireEvent('initiateObject', id);
        }
    },
    listeners: {
        afterRender: 'onVariableAfterRender'
    },
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: ['->', {
            iconCls: 'fa fa-table',
            xtype: 'button',
            hidden: true,
            text: Lang.t('general.viewdata'),
            handler: 'onViewData'
        }, {
            iconCls: 'fa fa-clipboard',
            id: 'exporterDetailClipboardJmp',
            xtype: 'button',
            tooltip: Lang.t('exporter.copyurltoclipbaord'),
            text: 'JMP'
        }, {
            iconCls: 'fa fa-download',
            xtype: 'button',
            text: Lang.t('general.iqyfile'),
            reference: 'exportervariqyfile',
            handler: 'onIqyFile'
        }, {
            iconCls: 'fa fa-file-excel-o',
            xtype: 'button',
            text: Lang.t('general.excelexport'),
            handler: 'onViewData'
        }, '-',  {
            iconCls: 'fa fa-upload',
            xtype: 'button',
            hidden: true,
            text: Lang.t('exporter.exceltemplate'),
            handler: 'onExcelUpload'
        },]
    }]
});


