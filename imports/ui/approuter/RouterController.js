import './AuthController';
import './SecureController';
import './classic/Viewport';

Ext.define('approuter.router.Controller', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.router',
    config: {
        routes: {
            ':id:id1:id2:id3:id4': {
                action: 'showRoute',
                conditions: {
                    ':id': '(?:(?::){1}([a-zA-Z0-9\Q=_ ,.+\E\-]+))?',
                    ':id1': '(?:(?::){1}([a-zA-Z0-9\Q=_ ,.+\E\-]+))?',
                    ':id2': '(?:(?::){1}([a-zA-Z0-9\Q=_ ,.+\E\-]+))?',
                    ':id3': '(?:(?::){1}([a-zA-Z0-9\Q=_ ,.+\E\-]+))?',
                    ':id4': '(?:(?::){1}([a-zA-Z0-9\Q=_ ,.+\E\-]+))?'
                }
            }
        }
    },

    showRoute: function (id) {
        let self = this;
        let layout = this.lookupReference(id);
        if (layout) {
            if (id === 'auth') {
                this.view.setActiveItem(layout);
            } else if (id === 'secure' && Meteor.userId()) {
                self.view.setActiveItem(layout);
            } else if (id === 'public') {
                this.view.setActiveItem(layout);
            } else if (id === 'rest') {
                this.view.setActiveItem(layout);
            }
        } else {
            this.view.setActiveItem(this.lookupReference('pagenotfound'));
        }
    }
});
