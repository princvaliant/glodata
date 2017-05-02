
let error = function(message, code) {
    show(message, code, 'red')
}

let warning = function(message, code) {
    show(message, code, 'orange')
}

let info = function(message, code) {
    show(message, code, 'darkgreen')
}

let show = function(message, code, color) {
    Ext.toast({
        html: '<div style="color:' + color + '"><b>' + message + '</b></div>',
        title: code,
        width: 350,
        autoCloseDelay: 4000
    });
}

export default {
    error,
    warning,
    info
}
