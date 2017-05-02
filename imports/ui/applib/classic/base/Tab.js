

Ext.define('applib.classic.base.Tab', {
    extend: 'Ext.panel.Panel',
    xtype: 'basetab',
    referenceHolder: true,
    layout: 'border',
    resizable: true,
    bodyPadding: 0,
    border: false,
    bodyBorder: false,
    defaults: {
        collapsible: true,
        split: true
    },
    style: {opacity: 0},
    onRender: function () {
        Ext.create('Ext.fx.Animator', {
            target: this,
            duration: 1300,
            keyframes: {
                '0%': {
                    left: 0,
                    opacity: 0
                },
                '100%': {
                    left: 0,
                    opacity: 1
                }
            }
        });
        this.callParent();
    },

    setArea: function (lev0, lev1, lev2) {
        let panel = this;
        if (this.hierarchy.L0 && !lev1 && !lev2) {
            applib.classic.util.Animator.cardSwitch(
                panel,
                panel.lookupReference(this.hierarchy.L0)
            )
        }
        if (this.hierarchy.L1 && lev1 && !lev2) {
            applib.classic.util.Animator.cardSwitch(
                panel,
                panel.lookupReference(this.hierarchy.L1)
            )
        }  else if (this.hierarchy.L2 && lev2) {
            applib.classic.util.Animator.cardSwitch(
                panel,
                panel.lookupReference(this.hierarchy.L2)
            )
        } else {
            applib.classic.util.Animator.show(panel);
        }
    },
    toL0: function (text) {
        let pc = this.down('basepathcrumb');
        pc.setIndex(1, text);
    },
    toL1: function (text) {
        let pc = this.down('basepathcrumb');
        pc.setIndex(2, text);
    },
    toL2: function (text) {
        let pc = this.down('basepathcrumb');
        pc.setIndex(3, text);
    }
});