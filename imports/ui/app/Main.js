import '../approuter/RouterController';

Meteor.startup(() => {
    Ext.onReady(function () {
        Meteor.call('userGet', Meteor.userId(), (user) => {
            Ext.application({
                name: 'app',
                appFolder: 'packages',
                defaultToken: ':secure',
                constructor() {
                    if (Ext.util.LocalStorage.supported) {
                        Ext.state.Manager.setProvider(new Ext.state.LocalStorageProvider({id: 'glodata'}));
                    } else {
                        let thirtyDays = new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 60))
                        Ext.state.Manager.setProvider(new Ext.state.CookieProvider({expires: thirtyDays}))
                    }
                    this.callParent(arguments);
                },
                launch: function () {
                    Ext.ariaWarn = Ext.emptyFn;
                    Ext.History.init();

                    Ext.create({
                        xtype: 'routerview',
                        renderTo: Ext.getBody()
                    });

                },
                onAppUpdate: function () {
                    Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
                        function (choice) {
                            if (choice === 'yes') {
                                window.location.reload();
                            }
                        }
                    );
                }
            });
        });
    });
});
