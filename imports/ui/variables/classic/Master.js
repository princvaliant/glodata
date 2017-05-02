import './master/Grid';
import './master/Tree';
import './master/AddForm';
import './master/View';
import '../Controller';
import '../MasterController';
import '../ViewModel';

Ext.define('variables.classic.Master', {
    extend: 'Ext.panel.Panel',
    xtype: 'variablesmaster',
    controller: 'variablesmaster',
    viewModel: {
        type: 'variables'
    },
    stateful: true,
    stateId: 'variablesmasterstateid',
    layout: 'border',
    items: [{
        xtype: 'variablestree',
        region: 'west',
        width: 300,
        header: false,
        collapsible: true,
        split: {
            size: 8
        }
    }, {
        xtype: 'variablesgrid',
        region: 'center'
    }]
    // , {
    //     xtype: 'variablesview',
    //     region: 'east',
    //     width: 300,
    //     header: false,
    //     collapsible: true,
    //     split: {
    //         size: 8
    //     }
    // }]
});