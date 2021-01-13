const CompraVenda   = require('../model/CompraVenda');
const Carteira   = require('../model/Carteira');

exports.store = function(req, res) {
        
        // CompraVenda.insertMany(req);
        return CompraVenda.create(req);
        
};

