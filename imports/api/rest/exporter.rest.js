import expApi from '../exporter/exporter.api';
import userHelper from '../util/userHelper';

HTTP.methods({
    '/getExporterData': {
        auth: userHelper.auth,
        get: function () {
            let exporter = Exporters.findOne({_id: this.query.id});
            let data = expApi.getData(exporter, this.userId);
            let result;
            if (this.query.format === 'csv') {
                result =  Papa.unparse(data);
            } else if (this.query.format === 'json') {
                result = JSON.stringify(data);
            } else if (this.query.format === 'jmp') {
                result = _buildHtmlTable(data, exporter);
            }
            data = null;
            return result;
        }
    }
});

function _buildHtmlTable(array, exporter) {
    let enableHeader = true;
    // If the returned data is an object do nothing, else try to parse
    if (!_.isArray(array)) {
        return '';
    }
    if (array.length === 0) {
        return 'NO DATA';
    }
    let expvars = ExporterVars.find({exporterId: exporter._id}, {sort: {ctg: 1, idx: 1}}).fetch();
    let head = new Set();
    _.each(expvars, (v) => {head.add(v.title)});
    let h = [...head];
    let str = '<table border="1">';
    // table head
    str += '<tr>';
    for (let index in h) {
        str += '<th scope="col">' + h[index] + '</th>';
    }
    str += '</tr>';
    // table body
    for (let i = 0; i < array.length; i++) {
        str += (i % 2 == 0) ? '<tr>' : '<tr>';
        for (let index in h) {
            let objValue = array[i][h[index]];
            // Support for Nested Tables
            if (typeof objValue === 'object' && objValue !== null) {
                if (Array.isArray(objValue)) {
                    str += '<td>';
                    for (let aindex in objValue) {
                        str += _buildHtmlTable(objValue[aindex]);
                    }
                    str += '</td>';
                } else {
                    if (objValue === null || objValue === undefined) {
                        str += '<td></td>';
                    } else if (_.isDate(objValue)) {
                       str += '<td>' + moment(objValue).format('YYYY/MM/DD hh:mm:ss') + '</td>'
                    } else {
                        str += '<td>' + objValue + '</td>';
                    }
                }
            } else {
                if (objValue === null || objValue === undefined) {
                    str += '<td></td>';
                } else if (_.isDate(objValue)) {
                    str += '<td>' + moment(objValue).format('YYYY/MM/DD hh:mm:ss') + '</td>'
                } else {
                    str += '<td>' + objValue + '</td>';
                }
            }

        }
        str += '</tr>';
    }
    str += '</table>';
    return str;
}