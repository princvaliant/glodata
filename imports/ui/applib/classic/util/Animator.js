
Ext.define('applib.classic.util.Animator', {
    singleton : true,
    cardSwitch : function(panel, child) {
        let current = panel.getLayout().getActiveItem();
        child.setStyle('opacity', 0);
        current.setStyle('opacity', 0);
        Ext.create('Ext.fx.Animator', {
            target: child,
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
        panel.getLayout().setActiveItem(child);
    },

    initOpacity:  {opacity: 0},
    showOpacity: function(panel) {
        Ext.create('Ext.fx.Animator', {
            target: panel,
            duration: 2300,
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
    }
});