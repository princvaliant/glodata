import '../../applib/classic/base/TabPanel';
import '../Controller';
import '../MasterController';
import '../MasterViewModel';
import './fileMeta/Content';
import './user/Content';

Ext.define('domain.classic.Master', {
    extend: 'applib.classic.base.TabPanel',
    xtype: 'domainmaster',
    controller: 'domainmaster',
    viewModel: {
        type: 'domainmaster'
    },
    activeTab: 0,
    initComponent: function () {
        this.callParent();
        this.enableBubble('route');
    },
    listeners: {
        tabchange: 'onTabChange'
    },
    items: [ {
        title: Lang.t('domain.user'),
        iconCls: 'fa fa-user',
        plugins: {
            ptype: 'lazyitems',
            items: {
                xtype: 'domainusercontent'
            }
        }
    }, {
        title: Lang.t('domain.filemeta'),
        iconCls: 'fa fa-file-text',
        plugins: {
            ptype: 'lazyitems',
            items: {
                xtype: 'domainfilemetacontent'
            }
        }
    }]
});