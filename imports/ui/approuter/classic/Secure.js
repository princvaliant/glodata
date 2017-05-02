
import '../../exporter/classic/Master';
import '../../visualizer/classic/Master';
import '../../genealogy/classic/Master';
import '../../variables/classic/Master';
import '../../domain/classic/Master';
import '../../help/classic/Panel';
import '../../myaccount/classic/Panel';


Ext.define('approuter.classic.Secure', {
    extend: 'Ext.tab.Panel',
    xtype: 'securepanel',
    controller: 'secure',
    referenceHolder: true,
    flex: 1,
    tabBarHeaderPosition: 0,
    plain: false,
    defaults: {
        bodyPadding: 0,
        bodyMargin: 0,
        border: false,
        layout: 'fit'
    },
    headerPosition: 'top',
    tabRotation: 'default',
    titleRotation: 'default',
    titleAlign: 'left',
    iconAlign: 'default',
    listeners: {
        tabchange: 'onTabChange',
        route: 'onRoute',
        activate: 'onActivate'
    }
});
