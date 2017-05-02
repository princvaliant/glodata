import './classic/AddExporter';
import Toast from  '../applib/classic/base/Toast';
import '../applib/classic/util/Downloader';
import  '../applib/store/MeteorStore';
import Clipboard from 'clipboard';

Ext.define('exporter.MasterController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.exportermaster',
    constructor: function () {
        this.callParent(arguments);
        this.bufferedSearch = Ext.Function.createBuffered(_search, 300);
        this.filter = {};
    },
    init: function () {
        let self = this;
        this.vm = this.getViewModel();
        Meteor.call('exporterGridDef', (err, result) => {
            let grid = this.getView().down('grid');
            let store = Ext.create('applib.store.Meteor', {
                fields: result.fields,
                proxy: {
                    type: 'meteor',
                    actionMethods: {
                        'read': 'exporterList',
                        'update': 'exporterUpdate',
                        'create': 'exporterCreate',
                        'destroy': 'exporterDestroy',
                        'duplicate': 'exporterDuplicate'
                    },
                    extraParams: {
                        search: '',
                        owner: '',
                        ctg: ''
                    }
                },
                listeners: {
                    exception: function (error) {
                        Toast.error(error.reason, error.error);
                    }
                }
            });
            grid.suspendLayout = true;
            let state = Ext.state.Manager.getProvider().state[grid.stateId];
            grid.reconfigure(store, result.columns);
            if (state) {
                grid.applyState(state);
            }
            grid.suspendLayout = false;
            self.filter = {
                search: self.lookupReference('exportersearch').value,
                owner: self.lookupReference('exportersonlymyfilter').checked,
                ctg: self.lookupReference('exportersctgfilter').value
            }
            self.bufferedSearch(self);
        });
    },
    onViewAfterRender: function () {
        new Ext.tip.ToolTip({
            target: this.lookup('exporterviewiqyfile').el,
            anchor: 'right',
            html: Lang.t('exporter.iqyhelp'),
            width: 415,
            autoHide: false,
            closable: true
        });
    },
    onSelectionChange: function (cmp, selected, eOpts) {
        let self = this;
        this.vm.set('disableDelete', selected[0].data.owner !== Meteor.user().username);
        Meteor.call('env', 'ROOT_URL', (error, addr) => {
            Meteor.call("getAccessToken", function(error, token){
                self.linkJmp = addr + 'getExporterData?id=' + selected[0].data._id + '&format=jmp&token=' + token;
                new Clipboard('#exporterClipboardJmp', {
                    text: function () {
                        return self.linkJmp;
                    }
                });
            });
        });
        Meteor.call('exporterFormDef', 'activeExporter', selected[0].data.owner, (err, result) => {
            let form = this.lookupReference('exportermasterviewform');
            form.removeAll();
            form.add(result.forms);
        });
    },
    onAddButton: function (btn) {
        let addWindow = Ext.create('exporter.classic.AddExporter');
        this.view.add(addWindow);
        addWindow.show();

    },
    onSaveNewExporter: function (btn) {
        let data = btn.up('form').getValues();
        let grid = this.getView().down('grid');
        grid.store.insert(0, data, (error) => {
            if (!error) {
                grid.getSelectionModel().select(0);
                let window = btn.up('window');
                window.destroy();
            }
        });
    },
    onRowDoubleClick: function () {
        this.fireViewEvent('route', 2, {
            target: 'exporterdetail',
            id: this.vm.get('activeExporter').data._id,
            name: this.vm.get('activeExporter').data.name
        });
    },
    onDeleteButton: function () {
        Ext.MessageBox.confirm(Lang.t('general.deletetitle'), Lang.t('general.deleteconfirm'), function (btn) {
            if (btn === 'yes') {
                let current = this.vm.get('activeExporter');
                let grid = this.getView().down('grid');
                grid.store.remove(current);
                grid.getSelectionModel().select(0);
            }
        }, this);
    },
    onDuplicateButton: function () {
        let grid = this.getView().down('grid');
        grid.store.duplicate(this.vm.get('activeExporter'), (error) => {
            if (!error) {
                grid.getSelectionModel().select(0);
            }
        });
    },
    onSearchChanged: function (cmp, newValue) {
        this.filter['search'] = newValue;
        this.bufferedSearch(this);
    },

    onCtgChanged: function (cmp, newValue) {
        this.filter['ctg'] = newValue;
        this.bufferedSearch(this);
    },

    onOwnerOnlyChanged: function (cmp, newValue) {
        this.filter['owner'] = newValue;
        this.bufferedSearch(this);
    },

    onViewData: function (btn) {
        let self = this;
        this.getView().setLoading(true);
        Meteor.call('exporterViewData', this.vm.get('activeExporter').data, (error, expData) => {
            if (error) {
                Toast.error(error.reason, error.error);
            } else {
                applib.classic.util.Downloader.excel(expData, self.vm.get('activeExporter').data.name);
            }
            this.getView().setLoading(false);
        })
    },
    onIqyFile: function (btn) {
        let a = document.createElement('a');
        let data = 'WEB\n' +
            '1\n' +
            this.linkJmp + '\n' +
            '\n' +
            'Selection=EntirePage\n' +
            'Formatting=All\n' +
            'PreFormattedTextToColumns=True\n' +
            'ConsecutiveDelimitersAsOne=True\n' +
            'SingleBlockTextImport=False\n';
        document.body.appendChild(a);
        a.style.display = 'none';
        a.href = encodeURI('data:attachment/txt;charset=utf-8,' + data);
        a.download = this.vm.get('activeExporter').data.name + '.iqy';
        a.click();
        document.body.removeChild(a);
    }
});

function _search(cntrl) {
    let grid = cntrl.getView().down('grid');
    grid.store.getProxy().extraParams = cntrl.filter;
    grid.store.currentPage = 1;
    grid.store.load();
}