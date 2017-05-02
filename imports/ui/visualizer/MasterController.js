Ext.define('visualizer.MasterController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.visualizermaster',
    constructor: function () {
        this.callParent(arguments);
        this.bufferedSearch = Ext.Function.createBuffered (_search, 300);
        this.filter = {};
    },
    init: function () {
        let self = this;
        let tree = self.getView().down('treepanel');
        let store = Ext.create('Ext.data.TreeStore', {
            folderSort: true,
            autoLoad: true,
            asynchronousLoad: true,
            fields: [{
                name: 'tag',
                type: 'string'
            }, {
                name: 'cnt',
                type: 'int'
            },{
                name: 'path',
                type: 'string'
            }],
            proxy: {
                type: 'meteor',
                actionMethods: {
                    'read': 'unitCategoryTree'
                },
                extraParams: {}
            },
            listeners: {
                exception: function (error) {
                    Toast.error(error.reason, error.error);
                }
            }
        });
        let columns =  [{
            xtype: 'treecolumn', //this is so we know which column will show the tree
            dataIndex: 'tag',
            flex: 5
        }, {
            dataIndex: 'cnt',
            flex: 1,
            align: 'right'
        }];
        tree.reconfigure(store, columns);
    },

    onTreeSelected: function (cmp, newValue) {
        let self = this;
        let grid = self.getView().down('grid');
        grid.getSelectionModel().deselectAll();
        grid.getSelectionModel().clearSelections();
        self.filter.tag = newValue[0].data.path;
        Meteor.call('unitGridDef', this.filter.tag, (err, result) => {
            let store = Ext.create('Ext.data.BufferedStore', {
                fields: result.fields,
                autoLoad: false,
                remoteSort: true,
                pageSize: 100,
                trailingBufferZone: 100,
                leadingBufferZone: 100,
                purgePageCount: 20,
                proxy: {
                    type: 'meteor',
                    actionMethods: {
                        'read': 'unitList'
                    },
                    extraParams: self.filter
                },
                listeners: {
                    exception: function (error) {
                        Toast.error(error.reason, error.error);
                    }
                }
            });
            grid.reconfigure(store, result.columns);
            grid.stateId =  'visualizermastergridstateid' + this.filter.tag;
            let state = Ext.state.Manager.getProvider().state[grid.stateId];
            if (state) {
                grid.applyState(state);
            }
            _search(self);
        });
    },

    onTreeSearchChanged: function (cmp, newValue) {
        let tree = this.getView().down('treepanel');
        tree.store.proxy.extraParams = {search: newValue};
        tree.store.reload();
    },

    onGridSearchChanged: function (cmp, newValue) {
        this.filter.search = newValue;
        this.bufferedSearch(this);
    },

    onGridSelectionChange: function(cmp, newValue) {
        let view = this.getView().down('visualizermasterview');
        let tag = this.filter.tag;
        view.removeAll(true);
        if (newValue.length > 0) {
            if (Ext.ClassManager.getByAlias('widget.' + tag)) {
                view.add({
                    xtype: tag,
                    config: {
                        tag: tag,
                        units: newValue
                    }
                });
            } else {
                view.add({
                   xtype: 'visualizermasterfields',
                   items: _.map(newValue, (unit, idx) => {
                      return {
                          xtype: 'propertygrid',
                          title: unit.data.idss.join(' ').toUpperCase(),
                          width: idx === 0 ? 350 : 150,
                          nameColumnWidth: idx === 0 ? 200 : 1,
                          source: unit.data.steps[tag],
                          viewConfig: {
                              enableTextSelection: true
                          },
                          listeners: {
                              afterrender: function(grid) {
                                  grid.findPlugin('cellediting').disable();
                              }
                          }
                      }
                   })
                });
            }
        }
    }
});

function _search(cntrl) {
    let grid = cntrl.getView().down('grid');
    grid.store.getProxy().extraParams = cntrl.filter;
    grid.store.load();
}