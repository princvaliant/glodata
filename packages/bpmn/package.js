Package.describe({
    // Short two-sentence summary.
    summary: "BPMN JS",
    // Version number.
    version: "1.0.0",

    name: "bpmn"

});

/* This defines your actual package */
Package.onUse(function (api) {
    // If no version is specified for an 'api.use' dependency, use the
    // one defined in Meteor 0.9.0.
    //
    api.versionsFrom('1.0');

    api.addFiles("bower_components/bpmn-js/dist/bpmn-modeler.js", ['client']);

    api.addFiles("bower_components/bpmn-js/dist/assets/diagram-js.css", "client");
    api.addFiles("bower_components/bpmn-js/dist/assets/bpmn-font/css/bpmn.css", "client");
    api.addFiles("bower_components/bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css", "client");

    api.addAssets("bower_components/bpmn-js/dist/assets/bpmn-font/font/bpmn.eot", "client");
    api.addAssets("bower_components/bpmn-js/dist/assets/bpmn-font/font/bpmn.svg", "client");
    api.addAssets("bower_components/bpmn-js/dist/assets/bpmn-font/font/bpmn.ttf", "client");
    api.addAssets("bower_components/bpmn-js/dist/assets/bpmn-font/font/bpmn.woff", "client");

    api.export('Modeler', ['client']);
    api.export('Viewer', ['client']);
});
