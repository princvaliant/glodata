import Toast from  '../applib/classic/base/Toast';
import { Accounts } from 'meteor/accounts-base'

Ext.define('approuter.auth.Controller', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.auth',
    config: {
        routes: {
            ':id:id1:id2': {
                before: 'beforeRoute',
                action: 'showRoute',
                conditions: {
                    ':id': '(?:(?::){1}([%a-zA-Z0-9\-\_\s,]+))?',
                    ':id1': '(?:(?::){1}([%a-zA-Z0-9\-\_\s,]+))?',
                    ':id2': '(?:(?::){1}([%a-zA-Z0-9\-\_\s,]+))?'
                }
            }
        }
    },

    beforeRoute: function (id, id1, id2, action) {
        let child = this.lookupReference(id1);
        if (id === 'auth' && child) {
            this.token = id2;
            action.resume();
        } else {
            action.stop();
        }
    },

    showRoute: function (id, id1, id2) {
        let child = this.lookupReference(id1);
        Ext.create('Ext.fx.Anim', {
           target: child,
           duration: 700,
           keyframes: {
               '0%': {
                   top: -400,
                   opacity: 0
               },
               '100%': {
                   top: 0,
                   opacity: 1
               }
           }
        });
        this.view.setActiveItem(child);
    },

    enterKey: function(field, e){
        if (e.getKey() === e.ENTER) {
            this.onLoginClick(field);
        }
    },

    onLoginClick: function (btn) {
        let form = btn.up('form').getForm();
        if (form.isValid()) {
            let self = this;
            let data = form.getValues();
            Meteor.loginWithPassword(data.email, data.password, function (err) {
                if (err) {
                    Toast.error(err.message, '');
                } else {
                    self.redirectTo(':secure:visualizer');
                }
            })
        }
    },

    onRegisterClick: function (btn) {
        let form = btn.up('form').getForm();
        if (form.isValid()) {
            let self = this;
            let data = form.getValues();
            if (data.password.length < 6) {
                Toast.error(Lang.t('register.pwdshort'), '');
            } else if (data.password !== data.verify) {
                Toast.error(Lang.t('register.notequal'), '');
            } else {
                let email = data.email.toLowerCase();
                Accounts.createUser({
                    username: email.split('@')[0],
                    email: email,
                    password: data.password,
                    profile: {
                        roles: ['OPERATOR'],
                        dataRoles: ['EXFAB_ACCESS']
                    }
                },  (err) => {
                    if (err) {
                        Toast.error(err.message, '');
                    } else {
                        Toast.info(Lang.t('register.emailsent'), '');
                        self.redirectTo(':auth:login');
                    }
                });
            }
        }
    },

    onForgotClick: function (btn) {
        let form = btn.up('form').getForm();
        if (form.isValid()) {
            let self = this;
            let data = form.getValues();
            Accounts.forgotPassword({
                email: data.email
            }, (err) => {
                if (err) {
                    Toast.error(err.message, '');
                } else {
                    Toast.info(Lang.t('forgot.emailsent'), '');
                    self.redirectTo(':auth:login');
                }
            });
        }
    },

    onResetClick: function (btn) {
        let form = btn.up('form').getForm();
        if (form.isValid()) {
            let self = this;
            let data = form.getValues();
            Accounts.resetPassword(this.token, data.password, function (err) {
                if (err) {
                    Toast.error(err.message, '');
                } else {
                    Toast.info(Lang.t('reset.passwordset'), '');
                    self.redirectTo(':auth:login');
                }
            })
        }
    }
});
