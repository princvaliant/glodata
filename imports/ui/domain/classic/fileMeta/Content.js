import '../../FileMetaController';
import './Grid';
import './AddForm';

Ext.define('domain.classic.fileMeta.Content', {
    extend: 'Ext.panel.Panel',
    xtype: 'domainfilemetacontent',
    controller: 'domainfilemeta',
    stateful: true,
    stateId: 'domainfilemetacontentstateid',
    layout: 'border',
    items: [{
        xtype: 'domainfilemetagrid',
        region: 'center'
    }]
});