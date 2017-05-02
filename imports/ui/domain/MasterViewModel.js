import '../applib/proxy/MeteorProxy';

Ext.define('domain.MasterViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.domainmaster',
    data: {
        activeFileMeta: null,
        activeStepTag: null,
        activeVariable: null,
        activeUser: null,
        activeDataRole: null,
        disableDelete: true
    }
});