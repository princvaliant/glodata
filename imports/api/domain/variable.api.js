import Variable from '../../model/domain/variable';

export default {

    insertVariableForDc: function (dc) {
        _.each([[dc.wc, dc.step, dc.vars], [dc.wc, null, dc.meta], [null, null, dc.ids]], (wcstep) => {
            let query = {
                ctg: dc.ctg,
                wc: wcstep[0],
                step: wcstep[1],
                name: {
                    $in: []
                }
            };
            if (wcstep[2] && _.isObject(wcstep[2])) {
                for (let field in wcstep[2]) {
                    if (wcstep[2].hasOwnProperty(field)) {
                       query.name .$in.push(this.getVariableName(field));
                    }
                }
                query.name .$in.push('_ts');
                let variables = Variable.cls.find(query, {fields: {name: 1}}).fetch();
                let listVars = _.map(variables, 'name');
                for (let field in wcstep[2]) {
                    if (wcstep[2].hasOwnProperty(field)) {
                        let varName = this.getVariableName(field);
                        if (_.indexOf(listVars, varName) === -1) {
                            let varType = this.getVariableType(wcstep[2][field]);
                            let variable = new Variable.cls();
                            variable.ctg = dc.ctg;
                            variable.wc = wcstep[0];
                            variable.step = wcstep[1];
                            variable.name = varName;
                            variable.title = field;
                            variable.type = varType;
                            variable.active = true;
                            variable.important = false;
                            variable.save();
                        }
                    }
                }
            }
        });
    },

    getVariablesByStep(tag, important) {
        if (tag === null || tag === undefined)
            return [];
        let tags = tag.split('__');
        let ctg = tags[0];
        let step = tags[2] || '';
        let variables = Variables.find({
            ctg: ctg,
            active: true,
            '$or': [
                {wc: null, step: null},
                {step: null, important: important || false},
                {step: step, important: important || false}
            ]
        }).fetch();
        variables.unshift({
            name: 'ts',
            title: 'Date',
            type: 'date',
            active: true
        });
        return variables;
    },

    getVariableName(field) {
        if (field === null || field === undefined)
            return '';
        if (field === '_ts')
            return 'Timestamp';
        let str = field.replace(/[\W]+/g, '_').toLowerCase();
        if (str[str.length - 1] === '_') {
            str = str.substring(0, str.length - 1);
        }
        str = str.replace('a_u_', 'au');
        str = str.replace('__', '_');
        return str;
    },

    // Determines variable type in depends on input string
    getVariableType: function (value) {
        if ((value !== null && value !== undefined && !_.isObject(value)) || _.isDate(value)) {
            let strval = value.toString().trim();
            let date0 =  _.isDate(value) ? moment(value) :  moment(strval, 'MM/DD/YYYY');
            let date1 = moment(strval, 'MM/DD/YYYY');
            let date2 = moment(strval, 'YYYY-MM-DD');
            let date3 = moment(strval, 'DD/MM/YYYY');
            let s0 = date0.format('MM/DD/YYYY').split('/');
            let s1 = date1.format('MM/DD/YYYY').split('/');
            let s2 = date2.format('YYYY-MM-DD').split('-');
            let s3 = date3.format('DD/MM/YYYY').split('/');
            let strvals = strval.split(/\/|\s|-/g);
            let floatMatch = strval.match(/^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/g);
            if (parseInt(s0[1]) === parseInt(strvals[2]) && parseInt(s0[2]) === parseInt(strvals[3]) && date0.isValid()) {
                return 'date';
            } else if (parseInt(s1[0]) === parseInt(strvals[0]) && parseInt(s1[1]) === parseInt(strvals[1]) && date1.isValid()) {
                return 'date';
            } else if (parseInt(s2[0]) === parseInt(strvals[0]) && parseInt(s2[1]) === parseInt(strvals[1])  && parseInt(s2[2]) === parseInt(strvals[2]) && date2.isValid()) {
                return 'date';
            } else if (parseInt(s3[0]) === parseInt(strvals[0]) && parseInt(s3[1]) === parseInt(strvals[1]) && date3.isValid()) {
                return 'date';
            } else if (!_.isNaN(parseInt(strval)) && strval.indexOf('.') === -1 && parseInt(strval).toString() === strval) {
                return 'int';
            } else if (!_.isNaN(parseFloat(strval)) && floatMatch && floatMatch.length === 1) {
                return 'float';
            } else if (['true', 'false', 'on', 'off', 'yes', 'no'].includes(strval.toLowerCase())) {
                return 'boolean';
            } else {
                return 'string'
            }
        }
        return 'undefined';
    },

    getVariableValue: function (value) {
        if ((value !== null && value !== undefined && !_.isObject(value)) || _.isDate(value)) {
            let strval = value.toString().trim();
            let date1 = moment(strval, 'MM/DD/YYYY hh:mm:ss');
            let date2 = moment(strval, 'YYYY-MM-DD hh:mm:ss');
            let date3 = moment(strval, 'DD/MM/YYYY hh:mm:ss');
            let s1 = date1.format('MM/DD/YYYY').split('/');
            let s2 = date2.format('YYYY-MM-DD').split('-');
            let s3 = date3.format('DD/MM/YYYY').split('/');
            let strvals = strval.split(/\/|\s|-/g);
            let floatMatch = strval.match(/^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/g);
            if (parseInt(s1[0]) === parseInt(strvals[0]) && parseInt(s1[1]) === parseInt(strvals[1]) && date1.isValid()) {
                return date1.toDate();
            } else if (parseInt(s2[0]) === parseInt(strvals[0]) && parseInt(s2[1]) === parseInt(strvals[1]) && parseInt(s2[2]) === parseInt(strvals[2]) && date2.isValid()) {
                return date2.toDate();
            } else if (parseInt(s3[0]) === parseInt(strvals[0]) && parseInt(s3[1]) === parseInt(strvals[1]) && date3.isValid()) {
                return date3.toDate();
            } else if (!_.isNaN(parseInt(strval)) && strval.indexOf('.') === -1 && parseInt(strval).toString() === strval) {
                return Number.parseInt(strval);
            } else if (!_.isNaN(parseFloat(strval)) && floatMatch && floatMatch.length === 1) {
                return Number.parseFloat(strval);
            } else if (['true', 'on', 'yes'].includes(strval.toLowerCase())) {
                return true;
            } else if (['false', 'off', 'no'].includes(strval.toLowerCase())) {
                return false;
            } else {
                return strval;
            }
        }
        return null;
    },

    getTree: function (filter) {
        if (!filter.ctg) {
            return [];
        }
        let match = {};
        if (filter.search) {
            match = {search: {$regex: '^' + filter.search.toLowerCase().trim()}};
        }
        match.ctg = filter.ctg;
        match.active = true;
        let expanded = filter.search === undefined || filter.search === '';

        let ret = Variables.aggregate([{
            $match: match
        }, {
            $sort: {
                wc: 1,
                step: 1,
                name: 1
            }
        }, {
            $group: {
                _id: {
                    wc: '$wc',
                    step: '$step'
                },
                text: {
                    $last: '$step',
                },
                children: {
                    $push: {
                        id: '$_id',
                        ctg: '$ctg',
                        wc: '$wc',
                        step: '$step',
                        name: '$name',
                        qtip: '$type',
                        title: '$title',
                        text: '$title',
                        iconCls: _getIconCls(),
                        type: '$type',
                        leaf: true
                    }
                }
            }
        },
            {
                $group: {
                    _id: '$_id.wc',
                    text: {
                        $last: '$_id.wc',
                    }
                    ,
                    iconCls: {
                        $last: 'fa fa-wrench di'
                    }
                    ,
                    expanded: {
                        $last: true
                    }
                    ,
                    children: {
                        $push: {
                            text: '$_id.step',
                            iconCls: 'fa fa-paw di',
                            expanded: !expanded,
                            children: '$children'
                        }
                    }
                }
            }
        ]);

        let f = _.filter(ret, {'text': null});
        let r = _.reject(ret, {'text': null});
        for (let i in r) {
            let wc = r[i];
            let f2 = _.filter(wc.children, {'text': null});
            if (f2.length === 1 && f2[0].children && f2[0].children.length > 0) {
                wc.children = _.union(f2[0].children, wc.children);
            }
            wc.children = _.reject(wc.children, {'text': null});
        }
        if (f.length === 1 && f[0].children && f[0].children.length > 0) {
            ret = _.union(f[0].children[0].children, ret);
        }
        return _.reject(ret, {'text': null});
    }
}


function _getIconCls() {
    return {
        $cond: {
            if: {$eq: ['$type', 'date']}, then: Settings.typeIcons['date'],
            else: {
                $cond: {
                    if: {$eq: ['$type', 'int']}, then: Settings.typeIcons['int'],
                    else: {
                        $cond: {
                            if: {$eq: ['$type', 'float']}, then: Settings.typeIcons['float'],
                            else: {
                                $cond: {
                                    if: {$eq: ['$type', 'boolean']},
                                    then: Settings.typeIcons['boolean'],
                                    else: {
                                        $cond: {
                                            if: {$eq: ['$type', 'string']},
                                            then: Settings.typeIcons['string'],
                                            else: Settings.typeIcons['undefined']
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}