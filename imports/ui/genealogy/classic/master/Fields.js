Ext.define('genealogy.classic.master.Fields', {
    extend: 'Ext.panel.Panel',
    xtype: 'genealogymasterfields',
    stateful: true,
    stateId: 'genealogymasterfieldstateid',
    title: Lang.t('genealogy.masterviewtitle'),
    layout: {
        type: 'hbox'
    },
    defaults: {
        border: false,
        padding: '5px'
    },
    scrollable: true
});