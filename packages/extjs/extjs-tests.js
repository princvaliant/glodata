// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by extjs.js.
import { Ext as packageName } from "meteor/extjs";

// Write your tests here!
// Here is an example.
Tinytest.add('extjs - example', function (test) {
  test.equal(packageName, "extjs");
});
