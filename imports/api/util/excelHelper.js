let XLSX = require('xlsx');

export default excelHelper = {
    toExcelWithTemplate: function (data, exporter, template) {
        let wsname = 'glodata';
        let wscols = _.times(200, () => {
            return {wpx: 120};
        });
        let wsrows = [];
        wsrows[0] = {hpt: 24};
        let expvars = ExporterVars.find({exporterId: exporter._id}, {sort: {ctg: 1, idx: 1}}).fetch();

        let workbook = {SheetNames: [], Sheets: {}};
        let ws = XLSX.utils.aoa_to_sheet(_processData(data, expvars), {cellDates: true});
        ws['!cols'] = wscols;
        ws['!rows'] = wsrows;
        workbook.SheetNames.push(wsname);
        workbook.Sheets[wsname] = ws;
        workbook.Props = {
            Title: exporter.name,
            Author: Meteor.user().username,
            Company: 'Apple',
            CreatedDate: new Date()
        };
        return XLSX.write(workbook, {type: 'binary'});
    }
};

function _processData(data, vars) {
    let result = [];
    if (_.isArray(data)) {
        if (data.length === 0) {
            throw new Meteor.Error(Lang.t('exporter.filtererrortitle'), Lang.t('exporter.nodatatitle'));
        }
        let head = new Set();
        _.each(vars, (v) => {
            head.add(v.title)
        });
        let h = [...head];
        result.push(h);
        _.each(data, (row) => {
            let obj = [];
            _.each(h, (field) => {
                if (row[field] === undefined || row[field] === null) {
                    obj.push('');
                } else if (_.isDate(row[field])) {
                    obj.push(moment(row[field]).format('YYYY/MM/DD hh:mm:ss'))
                } else {
                    obj.push(row[field]);
                }
            });
            result.push(obj);
        });
    }
    return result;
}

