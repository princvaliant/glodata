import '../../../applib/classic/base/Grid';

Ext.define('genealogy.classic.master.Grid', {
    extend: 'applib.classic.base.Grid',
    xtype: 'genealogymastergrid',
    bind: {
        selection: '{activeDc}'
    },
    stateful: true,
    stateId: 'genealogymastergridstateid',
    header: true,
    title: Lang.t('genealogy.unithistory'),
    minWidth: 250,
    multiSelect: true,
    listeners: {
        selectionchange: 'onGridSelectionChange',
    }
});