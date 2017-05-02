/**
 * Created by avolos on 3/3/17.
 */


Settings = {
    typeIcons: {
        date: 'fa fa-calendar bi',
        int: 'fa fa-tag yi"',
        float: 'fa fa-tags yi',
        boolean: 'fa fa-check ri"',
        string: 'fa fa-file-text gi',
        undefined: 'fa fa-gear di'
    },
    appRoles: [
        'ADMIN',
        'SUPERVISOR',
        'ENGINEER',
        'MANAGER',
        'OPERATOR'
    ],
    exporterFilters: {
        'int': [
            { id: '= x', regex: /^=\s|[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/g, mongo: ['$eq'], expected: 1},
            { id: '> x', regex: /^<\s|[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/g, mongo: ['$lt'], expected: 1},
            { id: '< x', regex: /^>\s|[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/g, mongo: ['$gt'], expected: 1},
            { id: '>= x', regex: /^>=\s|[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/g, mongo: ['$gte'], expected: 1},
            { id: '<= x', regex: /^<=\s|[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/g, mongo: ['$lte'], expected: 1},
            { id: 'between x,y', regex: /^between\s|[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/g, mongo: ['$gt', '$lt'], expected: 2},
            { id: 'between inclusive x,y', regex: /^between\sinclusive\s|[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/g, mongo: ['$gte', '$lte'], expected: 2},
            { id: 'blank', regex: /^blank$/g}
        ],
        'float': [
            { id: '= x', regex: /^=\s|[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/g, mongo: ['$eq'], expected: 1},
            { id: '> x', regex: /^<\s|[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/g, mongo: ['$lt'], expected: 1},
            { id: '< x', regex: /^>\s|[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/g, mongo: ['$gt'], expected: 1},
            { id: '>= x', regex: /^>=\s|[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/g, mongo: ['$gte'], expected: 1},
            { id: '<= x', regex: /^<=\s|[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/g, mongo: ['$lte'], expected: 1},
            { id: 'between x,y', regex: /^between\s|[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/g, mongo: ['$gt', '$lt'], expected: 2},
            { id: 'between inclusive x,y', regex: /^between\sinclusive\s|[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/g, mongo: ['$gte', '$lte'], expected: 2},
            { id: 'blank', regex: /^blank$/g}
        ],
        'date': [
            { id: 'last x days', regex: /(last\s)|(\d+)|(\sdays)/g, expected: 1},
            { id: 'next x days', regex: /(next\s)|(\d+)|(\sdays)/g, expected: 1},
            { id: 'between mm/dd/yyyy,mm/dd/yyyy', regex: /^between\s|[^,]+/g , expected: 2},
            { id: 'blank', regex: /^blank$/g}
        ],
        'string': [
            { id: 'not blank', regex: /^not blank$/g},
            { id: 'blank', regex: /^blank$/g},
            { id: 'in x,y...', regex: /^in\s|[^,]+/g },
            { id: 'begin with x,y...', regex: /^begin with\s|[^,]+/g }

        ],
        'boolean':[
            { id: 'true', regex: /^true$/g },
            { id: 'false', regex: /^false$/g }
        ]
    },
    stepTagDir: function(dirname) {
        let name = null;
        _.each(dirname.split('/'), (dir) => {
            if (name !== null) {
                name.push(dir);
            }
            if (dir === 'widgets') name = [];
        });
        return name.join('__');
    }
};