/**
 * Created by mmodric on 2/22/17.
 */

import { Class } from 'meteor/jagi:astronomy';

MMTests = new Mongo.Collection('unit');
//Fs = new Mongo.

let def = {
    name: 'unit',
    collection: MMTests
    /*fields: {
        // Name field of the report
        name: {
            type: String,
            validators: [{
                type: 'minLength',
                param: 5
            }]
        },
        createdAt: {
            type: Date
        },
        offset: {
            type: Integer
        },
        stepCategory: {
            type: String
        }
   }*/

};

let cls = Class.create(def);

export default {
    def, cls
}