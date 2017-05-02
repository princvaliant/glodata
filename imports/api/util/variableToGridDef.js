import userRolesHelper from './userRolesHelper';

export default vartogrid = {

    toColumns: function (variables) {
        let retObj = [];
        _.each(variables, (variable) => {
            let obj = {
                dataIndex: _getVarPath(variable),
                text: variable.title,
                allowBlank: true,
                width: variable.width || 130,
                sortable: true,
                hideable: true,
                stateful: true,
                stateId: variable.ctg + (variable.wc || '') + (variable.step || '') + variable.name + 'colstateid'
            };
            obj = _.extend(obj, _convertColumn(variable.type));
            if (variable.editor) {
                obj = _.extend(obj, _columnEditor(variable.type));
            }
            retObj.push(obj);
        });
        return retObj;
    },

    toFields: function (variables) {
        let retObj = [];
        _.each(variables, (variable) => {
            let obj = {
                name:  _getVarPath(variable),
                type: variable.type,
                mapping: _getVarPath(variable)
            };
            retObj.push(obj);
        });
        return retObj;
    }
}

function _getVarPath(variable) {
    if (variable.step && variable.important === true) {
        return 'steps.' + variable.ctg + '__' + variable.wc + '__' + variable.step + '.' + variable.name;
    } else if (variable.step === null && variable.wc === null) {
        return 'ids.' + variable.name;
    } else if (variable.wc) {
        return 'meta.' + variable.name;
    } else {
        return variable.name;
    }
}

function _columnEditor(type, precision, optional, validators, list, owner, roles) {
    let editor;
    let allowed = userRolesHelper.inRole(Meteor.user(), owner, roles)
    if (!allowed) {
        return {};
    }
    if (type === Boolean)
        editor = {
            xtype: 'checkboxfield'
        };
    else if (type === Number && precision > 0)
        editor = {
            xtype: 'numberfield',
            allowDecimals: true,
            decimalPrecision: precision
        };
    else if (type === Number && !precision)
        editor = {
            xtype: 'numberfield',
            allowDecimals: false,
            decimalPrecision: 0
        };
    else if (type === Date)
        editor = {
            xtype: 'datefield',
            format: 'Y-m-d H:i'
        };
    else
        editor = {
            xtype: 'textfield'
        };
    if (!optional) {
        editor.emptyText = 'required';
        editor.allowBlank = false;
    }
    if (list) {
        editor = {
            xtype: 'combobox',
            typeAhead: true,
            triggerAction: 'all',
            store: {
                xtype: 'store',
                fields: ['id'],
                data: _.map(list, (o) => {
                    return {id: o};
                })
            },
            valueField: 'id',
            displayField: 'id'
        }
    }
    return {editor: editor};
}


function _convertColumn(type) {
    if (type === 'boolean')  return {
        xtype: 'checkcolumn',
        disabled: true,
        trueText: 'yes',
        falseText: 'no'
    };
    if (type === 'float') return {
        xtype: 'numbercolumn',
        format: '0.000000'
    };
    if (type === 'int')  return {
        xtype: 'numbercolumn',
        format: '0'
    }
    if (type === 'date')  return {
        xtype: 'datecolumn',
        format: 'Y-m-d H:i'
    }
    return {};
}



