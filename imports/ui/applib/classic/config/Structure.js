

Ext.define('applib.classic.config.Structure', {
    singleton : true,
    ui_secure : [
        {
            tab: 'exporter',
            iconCls: 'fa fa-download',
            initCard: 'exportermaster',
            roles: ['OPERATOR']
        },  {
            tab: 'visualizer',
            iconCls: 'fa fa-television',
            initCard: 'visualizermaster',
            roles: ['OPERATOR']
        }, {
            tab: 'genealogy',
            iconCls: 'fa fa-align-left',
            initCard: 'genealogymaster',
            roles: ['OPERATOR']
        }, {
            tab: 'variables',
            iconCls: 'fa fa-quote-left',
            initCard: 'variablesmaster',
            roles: ['ADMIN', 'SUPERVISOR', 'MANAGER', 'ENGINEER']
        }, {
            tab: 'domain',
            iconCls: 'fa fa-cog',
            initCard: 'domainmaster',
            roles: ['ADMIN']
        }, {
        //     tab: 'help',
        //     iconCls: 'fa fa-question-circle',
        //     initCard: 'helppanel'
        // }, {
            tab: 'myaccount',
            iconCls: 'fa fa-user',
            initCard: 'myaccountpanel'
        }
    ]
});

