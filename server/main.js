
import '/imports/api/domain/main';
import '/imports/api/exporter/main';
import '/imports/api/genealogy/main';
import '/imports/api/charts/main';
import '/imports/api/rest/main';
import '/imports/api/scoop/main';
import '/imports/jobs/main';


_ = require('lodash');

Meteor.startup(function() {
    if (process.env.NODE_ENV !== 'development') {
        SyncedCron.start();
    }
    // let path = '/Users/avolos/a';
    // let chokidar = require('chokidar');
    // let watcher = chokidar.watch(path, {
    //     ignored: /(^|[\/\\])\../,
    //     persistent: true
    // });
    //
    // let log = console.log.bind(console);
    //
    // watcher
    //     .on('add', (path) =>
    //     {
    //         log(`File ${path} has been added`);
    //     })
    //     .on('change', (path) => {
    //         log(`File ${path} has been changed`);
    //     })
    //
    // var watchedPaths = watcher.getWatched();
    //
    // console.log('end1');
});