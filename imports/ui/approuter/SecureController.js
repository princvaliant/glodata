import '../applib/classic/config/Structure';
import './classic/secure/Tab';

Ext.define('approuter.secure.Controller', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.secure',
    config: {
        routes: {
            ':id:id1:id2:id3:id4': {
                before: 'beforeRoute',
                action: 'showRoute',
                conditions: {
                    ':id': '(?:(?::){1}([a-zA-Z0-9\Q=_ ,.+\E\-]+))?',
                    ':id1': '(?:(?::){1}([a-zA-Z0-9\Q=_ ,.+\E\-]+))?',
                    ':id2': '(?:(?::){1}([a-zA-Z0-9\Q=_ ,.+\E\-]+))?',
                    ':id3': '(?:(?::){1}([a-zA-Z0-9\Q=_ ,.+\E\-]+))?',
                    ':id4': '(?:(?::){1}([a-zA-Z0-9\Q=_ ,.+\E\-]+))?'
                }
            }
        },
        firstTab: {}
    },

    onActivate: function (panel, eOpts) {
        let tab = this.view;
        Ext.each(applib.classic.config.Structure.ui_secure, (panel) => {
            if (Accounts.can(panel.roles)) {
                tab.add({
                    title: Lang.t('navig.' + panel.tab),
                    reference: panel.tab,
                    iconCls: panel.iconCls,
                    plugins: {
                        ptype: 'lazyitems',
                        items: {
                            xtype: 'securetab',
                            reference: panel.tab + 'card',
                            controller: panel.tab,
                            viewModel: {
                                type: panel.tab
                            },
                            config: {
                                initCard: panel.initCard
                            }
                        }
                    }
                });
            }
        });

        tab.tabBar.insert(0, {
            xtype: 'button',
            scale: 'small',
            iconAlign: 'left',
            iconCls: 'fa fa-book',
            text: 'GLO DATA',
            cls: 'logo-btn'
        });
    },

    beforeRoute: function (id, id1, id2, id3, id4, action) {
        if (id === 'secure') {
            action.resume();
        } else {
            action.stop();
        }
    },

    showRoute: function (id, id1, id2, id3, id4) {
        let tab = this.view;
        if (!id1) {
            // If id1 is not populated then see if cookie is set otherwise select first tab
            id1 = Ext.util.Cookies.get('securepanel') ||
                applib.classic.config.Structure.ui_secure[0].tab;
        }
        let child = this.lookupReference(id1);
        if (child) {
            tab.suspendEvents();
            tab.setActiveTab(child);
            tab.resumeEvents();
            this.initCrumb(child, id, id1, id2, id3, id4);
            this.initCard(child, id, id1, id2, id3, id4);
            this.config.firstTab[child.reference] = true;
        }
    },

    onTabChange: function (tabPanel, newItem) {
        Ext.util.Cookies.set('securepanel', newItem.reference);
        if (!this.config.firstTab[newItem.reference]) {
            this.initCrumb(this, 'secure', newItem.reference);
            this.config.firstTab[newItem.reference] = true;
        } else {
            let pc = newItem.down('securepathcrumb');
            pc.redirect(this, false);
        }
    },

    onRoute: function (panel, level, routeObj) {
        let pnl = panel.up('securetab') || panel;
        let pc = pnl.down('securepathcrumb');
        pc.showCrumbLevel(this, routeObj, level);
    },

    initCrumb: function (child, id, id1, id2, id3, id4) {
        let panel = this.lookupReference(id1 + 'card');
        if (panel) {
            let pc = panel.down('securepathcrumb');
            if (pc) {
                pc.showCrumbs(this, id, id1, id2, id3, id4);
            }
        }
    },

    initCard: function (child, id, id1, id2, id3, id4) {
        let panel = this.lookupReference(id1 + 'card');
        if (panel) {
            let sc = panel.down('securecard');
            if (sc) {
                if (!id2 && !id3 && !id4) {
                    this.setActiveCard(sc, panel.config.initCard, null);
                } else {
                    let lst = [id4, id3, id2];
                    for (let i in lst) {
                        if (lst[i]) {
                            let tokens = lst[i].split('=');
                            this.setActiveCard(sc, tokens[0], tokens[1]);
                            break;
                        }
                    }
                }
            }
        }
    },

    setActiveCard(comp, name, value)
    {
        let found = comp.down(name);
        if (!found) {
            found = comp.add({xtype: name, reference: name});
        }
        comp.setActiveItem(found);
        if (_.isFunction(found.initData) && found.initializedDataId !== value) {
            found.initData(value);
            found.initializedDataId = value;
        }
    }
});
