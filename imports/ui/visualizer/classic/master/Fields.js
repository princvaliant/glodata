Ext.define('visualizer.classic.master.Fields', {
    extend: 'Ext.panel.Panel',
    xtype: 'visualizermasterfields',
    stateful: true,
    stateId: 'visualizermasterfieldstateid',
    title: Lang.t('visualizer.masterviewtitle'),
    layout: {
        type: 'hbox'
    },
    defaults: {
        border: false,
        padding: '5px'
    },
    scrollable: true
});