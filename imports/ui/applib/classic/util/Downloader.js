
Ext.define('applib.classic.util.Downloader', {
    singleton : true,
    excel : function(bindata, name) {
        let blob = new Blob([_s2ab(bindata)], {type: 'application/octet-stream'});
        let a = document.createElement('a');
        document.body.appendChild(a);
        a.style.display = 'none';
        a.href =  (window.URL || window.webkitURL).createObjectURL(blob);
        a.download = name + '.xlsx';
        a.click();
        document.body.removeChild(a);
    },
    csv : function(bindata, name) {
        let blob = new Blob([_s2ab(bindata)], {type: 'data:text/csv'});
        let a = document.createElement('a');
        document.body.appendChild(a);
        a.style.display = 'none';
        a.href =  (window.URL || window.webkitURL).createObjectURL(blob);
        a.download = name + '.csv';
        a.click();
        document.body.removeChild(a);
    }
});

function _s2ab(s) {
    let buf = new ArrayBuffer(s.length);
    let view = new Uint8Array(buf);
    for (let i=0; i !== s.length; ++i)
        view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}