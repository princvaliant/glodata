import '../../../applib/classic/base/Grid';
import './AddDataRole';

Ext.define('domain.classic.user.DataRole', {
    extend: 'applib.classic.base.Grid',
    xtype: 'domainuserdatarole',
    title: Lang.t('domain.usertitlerole'),
    plugins: [{
        ptype: 'cellediting',
        clicksToEdit: 1
    }],
    bind: {
        selection: '{activeDataRole}'
    },
    viewConfig: {
        plugins: {
            ptype: 'gridviewdragdrop',
            containerScroll: true,
            dragGroup: 'datarole-dd-grid-to-grid-group',
            dropGroup: 'userdatarole-dd-grid-to-grid-group',
            copy: true
        },
        listeners: {
           drop: 'onRemoveUserDataRole'
        }
    },
    stateful: true,
    stateId: 'domainuserdatarolestateid',
    modelValidation: true,
    multiSelect: false,
    dockedItems: [{
        xtype: 'toolbar',
        overflowHandler: 'scroller',
        items: [{
            xtype: 'textfield',
            stateful: true,
            stateId: 'domainuserdatarolesearchstateid',
            reference: 'domainuserrolesearch',
            width: '50%',
            emptyText: Lang.t('domain.usersearchrole'),
            enableKeyEvents: true,
            listeners: {
                change: {
                    buffer: 300,
                    fn: 'onDataRoleSearchChanged'
                }
            }
        }, '->', {
            text: Lang.t('exporter.addbutton'),
            iconCls: 'fa fa-plus',
            listeners: {
                click: 'onDataRoleAddButton'
            }
        }, {
            text: Lang.t('exporter.deleteButton'),
            iconCls: 'fa fa-remove',
            bind: {
                disabled: '{!activeDataRole}'
            },
            listeners: {
                click: 'onDataRoleDeleteButton'
            }
        }]
    }],
    bbar: {
        xtype: 'pagingtoolbar',
        displayInfo: true
    }
});