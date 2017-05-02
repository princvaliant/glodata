import '../../../applib/classic/util/Animator';
import './Pathcrumb';
import './Card';

Ext.define('approuter.classic.secure.Tab', {
    extend: 'Ext.container.Container',
    xtype: 'securetab',
    referenceHolder: true,
    layout: 'border',
    resizable: false,
    bodyPadding: 0,
    border: false,
    bodyBorder: false,
    defaults: {
        collapsible: false,
        split: true
    },
    initComponent: function () {
        this.callParent();
        this.enableBubble('route');
        this.enableBubble('tabchange');
    },
    onRender: function () {
        applib.classic.util.Animator.showOpacity(this);
        this.callParent(arguments);
    },
    style: applib.classic.util.Animator.initOpacity,
    items: [{
        xtype: 'securepathcrumb',
        collapsible: false,
        split: false,
        region: 'north'
    }, {
        xtype: 'securecard',
        region: 'center',
        layout: 'card'
    }]
});