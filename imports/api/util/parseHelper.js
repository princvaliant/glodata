import varApi from '../domain/variable.api';


export default parseHelper = {

    bytesToString(uint8array) {
        if (_.isString(uint8array)) {
            return uint8array;
        }
        if (uint8array === undefined || uint8array === null || uint8array.length === 0) {
            return '';
        }
        let buf = new Buffer(uint8array.byteLength);
        for (let i = 0; i < buf.length; ++i) {
            buf[i] = uint8array[i];
        }
        return buf.toString();
    },

    textBetween: function(text, start, end) {
        let ret = '';
        let reg = new RegExp(start + '([\\w\\W]*?)' + end, 'g');
        let s = text.match(reg);
        if (s !== null && s[0]) {
            ret = s[0].replace(start, '').replace(end, '');
        }
        while (ret[0] === '\r' || ret[0] === '\n') {
            ret = ret.substring(1)
        }
        return ret;
    },

    parseOneDelimiter: function(input, delimiter) {
        let result = {};
        let lines = input.split(/(\r\n|\n)/);
        lines.forEach((line) => {
            let vals = line.split(delimiter);
            if (vals.length === 2) {
                if (vals[0] !== undefined && _.isString(vals[0])) {
                    let key = vals[0].trim().replace(/\./g, "_");
                    result[key] = varApi.getVariableValue(vals[1]);
                }
            }
        });
        return result ;
    },

    parseTable: function(input, delimiter) {
        let result = {};
        let header = {};
        let headerRead = false;
        let lines = input.split(/(\r\n|\n)/);
        lines.forEach((line) => {
            let vals = line.split(delimiter);
            if (vals.length >= 2) {
                if (headerRead == false) {
                    header = vals;
                    headerRead = true;
                } else {
                    // don't use forEach, because we may have two same values, then indexOf will not work
                    // start with i = 1 to skip first column
                    for (let i = 1; i < vals.length; i++) {
                        vals[i] = vals[i].trim();
                        if (vals[0] !== undefined && _.isString(vals[0]) && header[i] !== undefined && _.isString(header[i])) {
                            let key = (vals[0].trim() + " " + header[i].trim()).replace(/\./g, "_");
                            if (!isNaN(vals[i])) {
                                result[key] = Number(vals[i]);
                            } else {
                                let date = moment(vals[i], 'M/D/YYY h:m:s a');
                                if (date.isValid() && date.isAfter('2010-01-01')) {
                                    result[key] = date.toDate();
                                } else {
                                    result[key] = vals[i];
                                }
                            }
                        }
                    }
                }
            }

        });
        return result;
    },



    parseVerticalPairs: function(input, delimiter) {
        let result = {};
        let keys = {};
        let values = {};
        let lines = input.split(/(\r\n|\n)/);
        let keysRead = false;
        lines.forEach((line) => {
            let vals = line.split(delimiter);
            if (vals.length >= 10) {
                 if (!keysRead) {
                     keysRead = true;
                     keys = vals.map(function(x) {
                         if (x !== undefined && _.isString(x)) {
                             return x.replace(/\./g, "_").trim();
                         } else {
                             return '';
                         }
                     });
                 } else {
                     for (let i = 0; i < vals.length; i++){
                         result[keys[i]] = varApi.getVariableValue(vals[i]);
                     }
                 }
            }
        });
        return result;
    },

    parseCsvTable: function(input) {
        let result = {};
        if (input !== undefined && _.isString(input)) {
            let values = Papa.parse(input.replace(/ NaN/g, null), {dynamicTyping: true, skipEmptyLines: true});
            let tmp = _.unzip(values.data);
            for (let i = 0; i < tmp.length; i++) {
                let key = tmp[i].shift();
                if (key !== undefined && _.isString(key)) {
                    key = key.replace(/\./g, "_").trim();
                    result[key] = tmp[i];
                }
            }
        }
        return result;
    },

    // uom is delimiter of the keys
    // for instance '0.1A/cm2 Raw' will be split to 0.1 and Raw
    parseCsvTableDescriptor: function(input, uom) {
        let result = {};
        if (input !== undefined && _.isString(input)) {
            let values = Papa.parse(input.replace(/ NaN/g, null), {dynamicTyping: true, skipEmptyLines: true});
            let descriptiveUom = _getUOM(uom);
            let tmp = _.unzip(values.data);
            for (let i = 0; i < tmp.length; i++) {
                let colName = tmp[i].shift();
                let vals = colName.split(uom);
                if ( _.last(vals) !== undefined) {
                    let key = _.last(vals).replace(/\./g, "_").trim();
                    if (vals.length == 1) {
                        result[key] = tmp[i];
                    } else {
                        let r1 = {};
                        let r2 = {};
                        let r3 = {};
                        r1[descriptiveUom] = _.first(vals);
                        r2['UOM'] = uom.trim();
                        r3[key] = tmp[i];
                        if (result[_.last(vals)] == undefined)
                            result[_.last(vals)] = [];
                        result[_.last(vals)].push(_.assign(r1, r2, r3));
                    }
                }
            }
        }
        return result;
    },

    extractJsonObjects: function(json) {
        let result = {};
        _jsonRecurseObjects(result, '', json);
        return result;
    },

    extractJsonArrays: function(json) {
        let result = {};
        _jsonRecurseArrays(result, '', json);
        return result;
    }
}

function _jsonRecurseObjects(result, keystr, value) {
    if (_.isPlainObject(value) && !_.isArray(value)) {
        _.forOwn(value, function(value, key) {
            _jsonRecurseObjects(result, keystr + ' ' + key, value);
        });
    } else if (value !== null && value !== undefined && !_.isArray(value) && value.toString().indexOf('ObjectID(') !== 0) {
        result[keystr.trim()] = value;
    }
}

function _jsonRecurseArrays(result, keystr, value) {
    if (_.isPlainObject(value) && !_.isArray(value)) {
        _.forOwn(value, function(value, key) {
            _jsonRecurseArrays(result, keystr + ' ' + key, value);
        });
    } else if (value !== null && value !== undefined && _.isArray(value) && value.length > 0) {
        if (_.isPlainObject(value[0])) {
            _.forOwn(value[0], function(val, key) {
                result[keystr.trim() + ' ' + key] = _.map(value, key);
            });
        } else {
            result[keystr.trim()] = value;
        }
    }
}

function _getUOM(abbr) {

    switch(abbr.trim()) {
        case 'A/cm2':
            return 'current density';
            break;
        case 'A':
        case 'mA':
            return 'current';
        case 'V':
        case 'mV':
            return 'voltage';
        default:
            return 'unknown';

    }

}