import Toast from  '../applib/classic/base/Toast';
import '../applib/classic/util/Downloader';
import './classic/SelectCtg';
import './classic/UploadExcel';
import './classic/detail/LinkForm';
import Clipboard from 'clipboard';

Ext.define('exporter.DetailController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.exporterdetail',
    init: function () {
        this.view.tabBar.add({
            xtype: 'button',
            reference: 'exporterdetailaddlinked',
            scale: 'small',
            iconCls: 'fa fa-plus',
            tooltip: Lang.t('exporter.addlinkeddata'),
            handler: 'onAddLinked',
            bind: {
                visible: '{isOwner}'
            }
        }, {
            xtype: 'button',
            reference: 'exporterdetaillink',
            scale: 'small',
            iconCls: 'fa fa-link',
            style: {
                marginTop: '20px;'
            },
            bind: {
                visible: '{numberOfTabs}'
            },
            tooltip: Lang.t('exporter.addlinks'),
            handler: 'onAddLinks'
        });
        this.control({
            'exporterdetail': {
                initiateObject: this.initiateObject
            }
        });
    },
    initiateObject: function (id) {
        let self = this;
        Meteor.call('exporterGet', id, (error, exporter) => {
            if (error) {
                Toast.error(error.reason, error.error);
            } else {
                self.getViewModel().set('exporter', exporter);
                self._populateLinkTabs(exporter, 0);
            }
            Meteor.call('env', 'ROOT_URL', (error, addr) => {
                Meteor.call("getAccessToken", function(error, token){
                    self.linkJmp = addr + 'getExporterData?id=' + exporter._id + '&format=jmp&token=' + token;
                    new Clipboard('#exporterDetailClipboardJmp', {
                        text: function () {
                            return self.linkJmp;
                        }
                    });
                });
            });
        });
    },
    onVariableAfterRender: function () {
        new Ext.tip.ToolTip({
            target: this.lookup('exportervariqyfile').el,
            anchor: 'right',
            html: Lang.t('exporter.iqyhelp'),
            width: 415,
            autoHide: false,
            closable: true
        });
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
        a.download = this.getViewModel().get('exporter').name + '.iqy';
        a.click();
        document.body.removeChild(a);
    },
    onViewData: function () {
        let self = this;
        this.getView().setLoading(true);
        Meteor.call('exporterViewData', self.getViewModel().get('exporter'), (error, expData) => {
            if (error) {
                Toast.error(error.reason, error.error);
            } else {
                applib.classic.util.Downloader.excel(expData, self.getViewModel().get('exporter').name);
            }
            this.getView().setLoading(false);
        })
    },
    onBeforeClose: function (cmp) {
        let self = this;
        if (Meteor.user().username === cmp.config.card.config.exporter.owner) {
            Ext.MessageBox.confirm(Lang.t('general.deletetitle'), Lang.t('general.deleteconfirm'), function (btn) {
                if (btn === 'yes') {
                    Meteor.call('exporterVarRemoveByExporterCtg', cmp.config.card.config.exporterId, cmp.config.card.config.ctg, (error, exporter) => {
                        if (error) {
                            Toast.error(error.reason, error.error);
                        } else {
                            self.getViewModel().set('exporter', exporter);
                            self._populateLinkTabs(exporter, 0);
                        }
                    })
                }
            }, this);
        }
        return false;
    },
    onAddLinked: function () {
        let self = this;
        let selectCtg = Ext.create('exporter.classic.SelectCtg');
        Meteor.call('ctgList', (error, ctgs) => {
            if (error) {
                Toast.error(error.reason, error.error);
            } else {
                let filter = _.map(self.getViewModel().get('exporter').links, 'ctg');
                let data = [];
                _.each(ctgs.data, (ctg) => {
                    if (_.indexOf(filter, ctg._id) === -1) {
                        data.push([ctg._id]);
                    }
                });
                selectCtg.down('combobox').store.loadData(data);
                self.view.add(selectCtg);
                selectCtg.show();
            }
        });
    },
    onSelectCtg: function (btn) {
        let self = this;
        let data = btn.up('form').getValues();
        let links =  self.getViewModel().get('exporter').links;
        let size = links.length;
        links.push({
            idx: size,
            key: 'linked',
            ctg: data.ctg
        });
        Meteor.call('exporterUpdate', self.getViewModel().get('exporter'), (error, exporter) => {
            if (error) {
                Toast.error(error.reason, error.error);
            } else {
                self.getViewModel().set('exporter', exporter);
                let window = btn.up('exporterselectctg');
                window.destroy();
                self._populateLinkTabs(exporter, size);
            }
        });
    },
    onAddLinks: function () {
        let linkForm = Ext.create('exporter.classic.detail.LinkForm');
        this.view.add(linkForm);
        let form = linkForm.down('form');
        this._populateLinkForm(form, this.getViewModel().get('exporter'));
        linkForm.show();
    },
    onExcelUpload: function () {
        let addWindow = Ext.create('exporter.classic.UploadExcel');
        this.view.add(addWindow);
        addWindow.show();
    },
    onFileFieldAfterRender: function (field) {
        let self = this;
        document.getElementById('exporterexcelfileuploadtemplate')
            .addEventListener('change', (event) => {
                    let file = event.target.files[0];
                    if (!file) return;
                    let reader = new FileReader(); //create a reader according to HTML5 File API
                    reader.onload = function (event) {
                        let buffer = new Uint8Array(reader.result); // convert to binary
                        Meteor.call('exxporterSaveExcelTemplate', self.getViewModel().get('exporter'), buffer, (error) => {
                            if (error) {
                                Toast.error(error.reason, error.error);
                            } else {
                                Toast.info(Lang.t('exporter.uploadsuccess'));
                                let window = self.lookupReference('exporteruploadexcelwindow');
                                window.destroy();
                            }
                        });
                    }
                    reader.readAsArrayBuffer(file); //read the file as arraybuffer
                },
                false);
    },
    onLinkFormSave: function (btn) {
        let self = this;
        let data = btn.up('form').getValues();
        for (let i = 0; i <  self.getViewModel().get('exporter').links.length; i++) {
            let link =  self.getViewModel().get('exporter').links[i];
            if (link.key !== 'master') {
                link.masterId = data[link.ctg + 'master'];
                link.linkedId = data[link.ctg + 'linked'];
                link.type = data[link.ctg + 'type'];
            }
        }
        Meteor.call('exporterUpdate', self.getViewModel().get('exporter'), (error, exporter) => {
            if (error) {
                Toast.error(error.reason, error.error);
            } else {
                self.getViewModel().set('exporter', exporter);
                let window = btn.up('exporterdetaillinkform');
                window.destroy();
                let grids = Ext.ComponentQuery.query('exporterdetailgrid');
                _.each(grids, (grid) => {
                    setTimeout(() => {
                        grid.store.reload();
                    }, 200);
                });

            }
        });
    },

    _populateLinkTabs: function (exporter, selected) {
        this.getView().removeAll();
        this.getViewModel().set('isOwner', Meteor.user().username === exporter.owner);
        this.getViewModel().set('numberOfTabs', exporter.links.length > 1 && Meteor.user().username === exporter.owner);
        _.each(exporter.links, (link) => {
            this.getView().add({
                xtype: 'exporterdetailcontent',
                closable: link.key !== 'master',
                title: link.ctg + ' - ' + link.key.toUpperCase(),
                config: {
                    exporter: exporter,
                    exporterId: exporter._id,
                    ctg: link.ctg
                }
            });
        }, this);
        setTimeout(() => {
            if (selected !== null) {
                this.getView().setActiveTab(selected);
            }
        }, 50);
    },

    _populateLinkForm: function (form, exporter) {
        let self = this;
        if (exporter && exporter.links.length > 1) {
            Meteor.call('exporterVarList', {exporterId: exporter._id}, (error, exporterVars) => {
                if (error) {
                    Toast.error(error.reason, error.error);
                } else {
                    let masterCtg = _.filter(exporter.links, {key: 'master'})[0];
                    let linkCtgs = _.filter(exporter.links, {key: 'linked'});
                    let masterData = _.orderBy(_.filter(exporterVars.data, {ctg: masterCtg.ctg}), 'title');
                    _.each(linkCtgs, (link) => {
                        let linkedData = _.orderBy(_.filter(exporterVars.data, {ctg: link.ctg}), 'title');
                        let fields = self._createLinkFields(link, masterData, linkedData);
                        form.add(fields);
                    });
                }
            });
        }
    },

    _createLinkFields(link, masterdata, linkedData) {
        return {
            xtype: 'fieldset',
            title: link.ctg,
            collapsible: false,
            defaults: {
                anchor: '100%',
                layout: 'hbox'
            },
            items: [{
                xtype: 'fieldcontainer',
                combineErrors: false,
                defaults: {
                    hideLabel: true,
                    flex: 1,
                    margin: '3 3 3 3',
                    xtype: 'combobox',
                    allowBlank: false,
                    editable: false,
                    forceSelection: true
                },
                items: [{
                    emptyText: 'Master field',
                    name: link.ctg + 'master',
                    value: link.masterId,
                    flex: 4,
                    displayField: 'title',
                    valueField: '_id',
                    store: Ext.create('Ext.data.Store', {
                        autoLoad: true,
                        fields: ['_id', 'title'],
                        data: masterdata
                    }),
                    editable: false,
                    triggerAction: 'all',
                    queryMode: 'local'
                }, {
                    emptyText: 'Linked field',
                    name: link.ctg + 'linked',
                    value: link.linkedId,
                    flex: 4,
                    displayField: 'title',
                    valueField: '_id',
                    store: Ext.create('Ext.data.Store', {
                        autoLoad: true,
                        fields: ['_id', 'title'],
                        data: linkedData
                    }),
                    editable: false,
                    triggerAction: 'all',
                    queryMode: 'local'
                }, {
                    flex: 2,
                    emptyText: 'Link type',
                    name: link.ctg + 'type',
                    value: link.type,
                    store: [
                        'Left join'
                        // , 'Right join',
                        // 'Full join'
                    ]
                }]
            }]
        };
    }
});

