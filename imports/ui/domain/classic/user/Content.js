import '../../UserController';
import './Grid';
import './View';
import './DataRole';


Ext.define('domain.classic.user.Content', {
    extend: 'Ext.panel.Panel',
    xtype: 'domainusercontent',
    controller: 'domainuser',
    stateful: true,
    stateId: 'domainusercontentstateid',
    layout: 'border',
    items: [{
        xtype: 'domainusergrid',
        region: 'west',
        width: 370,
        header: false,
        collapsible: true,
        split: {
            size: 8
        }
    }, {
        xtype: 'domainuserview',
        region: 'center',
        header: true
    }, {
        xtype: 'domainuserdatarole',
        region: 'east',
        width: 300,
        header: true,
        collapsible: true,
        split: {
            size: 8
        }
    }]
});