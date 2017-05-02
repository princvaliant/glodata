Ext.define('approuter.classic.secure.Pathcrumb', {
    extend: 'Ext.Container',
    xtype: 'securepathcrumb',
    isBreadcrumb: true,
    baseCls: Ext.baseCSSPrefix + 'breadcrumb',
    _breadcrumbCls: Ext.baseCSSPrefix + 'breadcrumb',
    _btnCls: Ext.baseCSSPrefix + 'breadcrumb-btn',
    _folderIconCls: Ext.baseCSSPrefix + 'breadcrumb-icon-folder',
    _leafIconCls: Ext.baseCSSPrefix + 'breadcrumb-icon-leaf',
    layout: 'hbox',
    ids: [],
    names: ['','','','',''],
    cntrl: null,


    showCrumbs: function (cntrl, id, id1, id2, id3, id4) {
        this.cntrl = cntrl;
        this.ids = this.redirect(cntrl, [id, id1, id2, id3, id4]);
        this.showCrumb();
    },

    showCrumbLevel: function (cntrl, routeObj, level) {
        let id ;
        if (_.isObject(routeObj)) {
            id = routeObj.target + '=' + routeObj.id;
            this.names[level] = routeObj.name || routeObj.id;
        } else {
            id = routeObj;
        }
        if (this.names[level + 1]) this.names[level + 1] = '';
        if (this.names[level + 2]) this.names[level + 2] = '';
        if (this.names[level + 3]) this.names[level + 3] = '';
        this.ids[level] = id;
        if (this.ids[level + 1]) this.ids[level + 1] = null;
        if (this.ids[level + 2]) this.ids[level + 2] = null;
        if (this.ids[level + 3]) this.ids[level + 3] = null;
        this.ids = this.redirect(cntrl, this.ids);
        this.showCrumb();
    },

    redirect: function(cntrl, arr) {
        let url = '';
        let ret = [];
        let rid = arr;
        if (!arr) {
            rid = this.ids;
        }
        for (let i = 0; i < 5; i++) {
            if (rid[i]) {
                ret.push(rid[i])
                url += ':' + rid[i];
            }
        }
        cntrl.redirectTo(url);
        return ret;
    },

    showCrumb: function () {
        this.removeAll(true);
        for (let i = 0; i < 5; i++) {
            if (this.ids[i]) {
                this.add(this._createButton(i, this.ids[i]));
            }
        }
    },

    setIndex: function (idx, text) {
        let txt = text || this.ids[idx];
        for (let i = idx; i < 5; i++) {
            this.ids[i] = undefined;
        }
        this.ids[idx] = txt;
        this.redirect(this.cntrl,  this.ids);
    },

    _createButton: function(idx, id) {
        let o = id.split('=');
        let o2 = o[1];
        if (o2 && o2 === '_new_') {
            o2 = Lang.t('navig.' + o2);
        }
        let name = this.names[idx] || Lang.t('navig.' + o[0]) + ' ' + (o2 || '');
        return Ext.create({
            xtype: 'button',
            iconCls: idx > 0 ? 'fa fa-caret-right' : '',
            ui: 'plain-toolbar',
            idx: idx,
            text:  '<b>' + name + '</b>',
            showEmptyMenu: false,
            handler: this._onButtonClick,
            scope: this
        });
    },
    _onButtonClick: function(btn) {
        if (btn.idx > 0) {
            this.setIndex(btn.idx);
        }
    }
});