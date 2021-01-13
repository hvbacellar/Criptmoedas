const CTT           = require('../Constantes');

exports.funcaoTeste = function(arg1,arg2) {
    console.log(arg1 + ' | ' + arg2);
}

exports.verificaDoken = function(arg1) {
    return arg1.doken == CTT.DOKEN;
}