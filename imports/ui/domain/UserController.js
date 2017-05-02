import Toast from  '../applib/classic/base/Toast';

Ext.define('domain.UserController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.domainuser',
    constructor: function () {
        this.callParent(arguments);
        this.bufferedSearch = Ext.Function.createBuffered(_search, 300);
        this.bufferedSearchDataRole = Ext.Function.createBuffered(_searchDataRole, 300);
        this.filter = {};
        this.filterDataRole = {};
    },
    init: function () {
        let self = this;
        let grid = self.getView().down('grid');
        let store = Ext.create('applib.store.Meteor', {
            remoteSort: false,
            remoteFilter: false,
            fields: [{
                name: 'username',
                type: 'string'
            }, {
                name: 'email',
                type: 'string'
            }, {
                name: 'verified',
                type: 'boolean'
            }, {
                name: 'lastLogin',
                type: 'date'
            }, {
                name: 'first',
                type: 'string'
            }, {
                name: 'last',
                type: 'string'
            }, {
                name: 'company',
                type: 'string'
            }],
            proxy: {
                type: 'meteor',
                actionMethods: {
                    'read': 'userList',
                    'update': 'userUpdate',
                    'destroy': 'userDestroy'
                },
                extraParams: {
                    search: ''
                }
            },
            listeners: {
                exception: function (error) {
                    Toast.error(error.reason, error.error);
                }
            }
        });
        grid.reconfigure(store, [
            {
                dataIndex: 'username',
                text: Lang.t('register.username'),
                stateful: true,
                stateId: 'domainuserusernamecolid',
                width: 130
            }, {
                dataIndex: 'email',
                text: Lang.t('register.email'),
                stateful: true,
                stateId: 'domainuseremailcolid',
                width: 200
            }, {
                dataIndex: 'verified',
                text: Lang.t('register.verify'),
                xtype: 'checkcolumn',
                disabled: true,
                stateful: true,
                stateId: 'domainusereverifiedcolid',
                width: 70
            }, {
                dataIndex: 'lastLogin',
                text: Lang.t('register.lastLogin'),
                xtype: 'datecolumn',
                format: 'Y-m-d H:i',
                stateful: true,
                stateId: 'domainuserlastlogincolid',
                width: 150
            }
        ]);
        let state = Ext.state.Manager.getProvider().state[grid.stateId];
        if (state) {
            grid.applyState(state);
        }
        this.bufferedSearch(this);

        Meteor.call('dataRoleGridDef', (err, result) => {
            let gridDataRole = self.getView().down('domainuserdatarole');
            let storeDataRole = Ext.create('applib.store.Meteor', {
                fields: result.fields,
                proxy: {
                    type: 'meteor',
                    actionMethods: {
                        'read': 'dataRoleList',
                        'create': 'dataRoleCreate',
                        'update': 'dataRoleUpdate',
                        'destroy': 'dataRoleDestroy'
                    },
                    extraParams: {
                        search: '',
                        owner: '',
                        ctg: ''
                    }
                }
            });
            gridDataRole.suspendLayout = true;
            let stateDataRole = Ext.state.Manager.getProvider().state[gridDataRole.stateId];
            gridDataRole.reconfigure(storeDataRole, result.columns);
            if (stateDataRole) {
                gridDataRole.applyState(stateDataRole);
            }
            gridDataRole.suspendLayout = false;
            self.bufferedSearchDataRole(self);
        });
    },

    // User grid related functions
    onSelectionChange: function (cmp, selected, eOpts) {
        let appRoles = this.lookupReference('propertygridapproles');
        let roles = selected[0].data.roles;
        appRoles.sourceConfig = _.reduce(Settings.appRoles, (result, val) => {
            result[val] = {
                renderer: function (d) {
                    return d === true ? '<div style="text-align:center;">Y</div>' : '';
                },
                editor: Ext.create('Ext.form.field.Checkbox')
            };
            return result
        }, {});
        appRoles.setSource(_.reduce(Settings.appRoles, (result, val) => {
            result[val] = _.indexOf(roles, val) >= 0;
            return result
        }, {}));

        let dataRoles = this.lookupReference('propertygriddataroles');
        let droles = selected[0].data.dataRoles;
        dataRoles.setSource(_.reduce(droles, (result, val) => {
            result[val] = '';
            return result
        }, {}));
    },
    onAppRolesPropertyChange: function (source) {
        let current = this.getViewModel().get('activeUser');
        let roles = [];
        _.forIn(source, (value, key) => {
            if (value) {
                roles.push(key);
            }
        });
        current.set('roles', roles);
    },
    onAddUserDataRole: function(node, data, dropRec) {
        let current = this.getViewModel().get('activeUser');
        if (_.indexOf(current.data.dataRoles, data.records[0].data.name) === -1) {
            let droles = current.data.dataRoles.concat([data.records[0].data.name]);
            current.set('dataRoles', droles);
        }
        let dataRoles = this.lookupReference('propertygriddataroles');
        dataRoles.setSource(_.reduce(current.data.dataRoles, (result, val) => {
            result[val] = '';
            return result
        }, {}));
    },
    onRemoveUserDataRole: function(node, data, dropRec) {
        let current = this.getViewModel().get('activeUser');
        let removes = _.without(current.data.dataRoles, data.records[0].data.name);
        current.set('dataRoles', removes);
        let dataRoles = this.lookupReference('propertygriddataroles');
        dataRoles.setSource(_.reduce(removes, (result, val) => {
            result[val] = '';
            return result
        }, {}));
    },
    onDeleteButton: function () {
        Ext.MessageBox.confirm(Lang.t('general.deletetitle'), Lang.t('general.deleteconfirm'), function (btn) {
            if (btn === 'yes') {
                let current = this.getViewModel().get('activeUser');
                let grid = this.getView().down('grid');
                grid.store.remove(current);
                grid.getSelectionModel().select(0);
            }
        }, this);
    },
    onUserSearchChanged: function (cmp, newValue) {
        this.filter.search = newValue;
        this.bufferedSearch(this);
    },

    // Data role grid related functions
    onDataRoleSearchChanged: function (cmp, newValue) {
        this.filterDataRole.search = newValue;
        this.bufferedSearchDataRole(this);
    },

    onDataRoleAddButton: function () {
        let addWindow = Ext.create('domain.classic.user.AddDataRole');
        this.view.add(addWindow);
        addWindow.show();

    },
    onDataRoleDeleteButton: function () {
        Ext.MessageBox.confirm(Lang.t('general.deletetitle'), Lang.t('general.deleteconfirm'), function (btn) {
            if (btn === 'yes') {
                let current = this.getViewModel().get('activeDataRole');
                let grid = this.getView().down('domainuserdatarole');
                grid.store.remove(current);
                grid.getSelectionModel().select(0);
            }
        }, this);
    },
    onDataRoleSaveButton: function(btn) {
        let data = btn.up('form').getValues();
        let grid = this.getView().down('domainuserdatarole');
        grid.store.insert(0, data, (error) => {
            if (!error) {
                grid.getSelectionModel().select(0);
                let window = btn.up('window');
                window.destroy();
            }
        });
    }
});

function _search(cntrl) {
    let grid = cntrl.getView().down('grid');
    grid.store.getProxy().extraParams = cntrl.filter;
    grid.store.currentPage = 1;
    grid.store.load();
}
function _searchDataRole(cntrl) {
    let grid = cntrl.getView().down('domainuserdatarole');
    grid.store.getProxy().extraParams = cntrl.filterDataRole;
    grid.store.currentPage = 1;
    grid.store.load();
}
