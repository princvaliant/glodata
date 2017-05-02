import {Meteor} from 'meteor/meteor'

if (Meteor.isClient) {

    // List of step tags to get data from
    const stepTag = Settings.stepTagDir(__dirname);

    // Definition of one or more views ////////////////////
    Ext.define(stepTag + '.View', {
        extend: 'Ext.panel.Panel',
        xtype: stepTag,
        controller: stepTag,
        layout: 'hbox',
        defaults: {
            border: false,
            padding: '0px',
        },
        scrollable: true,
        listeners: {
            afterrender: 'onAfterRender'
        },
        masked: {
            xtype: 'loadmask',
            indicator: true,
            msg: 'Load charts ...'
        },
        items: [{
            layout: {
                type: 'table',
                columns: 2,
                tableAttrs: {
                    style: {
                        width: '100%'
                    }
                },
                tdAttrs: {
                    valign: 'top'
                }
            },
            defaults: {
                border: true,
                padding: '4px'
            },
            items: [
                {
                    xtype: 'panel',
                    html: 'TEST'
                }
            ]
        }]
    });

    // Definition of one controller for the view /////////////////
    Ext.define(stepTag + '.Controller', {
        extend: 'Ext.app.ViewController',
        alias: 'controller.' + stepTag,
        config: {},
        onAfterRender: function (cmp) {
            cmp.setLoading(true);
            Meteor.call('graphGetForUnit', cmp.config.units[0].data._id, cmp.config.tag, 0, {}, (error, graph) => {
                if (error) {
                    Toast.error(error.reason, error.error);
                } else {

                }
                cmp.setLoading(false);
            });
        }
    });
}