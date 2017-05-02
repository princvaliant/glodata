import userRolesHelper from './userRolesHelper';

export default astro = {

    toForm: function (def, bindString, owner) {
        let retObj = [];
        for (let field in def.fields) {
            if (def.fields.hasOwnProperty(field)) {
                let val = def.fields[field];
                if (val.form) {
                    let obj = {
                        idx: val.form.idx || 0,
                        text: Lang.t(def.name + '.' + field),
                        value: '',
                        allowBlank: val.optional === true
                    };
                    if (bindString) {
                        obj.bind = '{' + bindString + '.' + field + '}';
                    }
                    obj = _.extend(obj, _formEditor(val, owner));
                    obj.fieldLabel = Lang.t(def.name + '.' + field);
                    retObj.push(obj);
                }
            }
        }
        return _.sortBy(retObj, function(o) {return o.idx;});
    }
}


function _formEditor(val, owner) {
    let allowed = userRolesHelper.inRole(Meteor.user(), owner, val.roles);
    if (allowed) {
        return _constructEditor(val);
    }
    return _constructViewer(val.type, val.precision);
}

function _constructEditor(val) {
    let editor;
    if (val.choices) {
        editor = {
            xtype: 'combo'
        };
     //  choices.collection
    } else if (val.type === Boolean)
        editor = {
            xtype: 'checkboxfield'
        };
    else if (val.type === Number && val.precision > 0)
        editor = {
            xtype: 'numberfield',
            allowDecimals: true,
            decimalPrecision: precision
        };
    else if (val.type === Number && !val.precision)
        editor = {
            xtype: 'numberfield',
            allowDecimals: false,
            decimalPrecision: 0
        };
    else if (val.type === Date)
        editor = {
            xtype: 'datefield',
            format: 'Y-m-d H:i'
        };
    else
        editor = {
            xtype: 'textfield'
        };
    if (!val.optional) {
        editor.emptyText = 'required';
        editor.allowBlank  = false;
    }
    if (val.form && val.form.xtype) {
        editor.xtype = val.form.xtype;
    }
    return editor;
}

function _constructViewer(type, precision) {
    let viewer;
    if (type === Boolean)
        viewer = {
            xtype: 'displayfield'
        };
    else if (type === Number && precision > 0)
        viewer = {
            xtype: 'displayfield'
        };
    else if (type === Number && !precision)
        viewer = {
            xtype: 'displayfield'
        };
    else if (type === Date)
        viewer = {
            xtype: 'displayfield',
            renderer: Ext.util.Format.dateRenderer('m/d/y H:i')
        };
    else
        viewer = {
            xtype: 'displayfield'
        };
    return viewer;
}
