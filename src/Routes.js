const express           = require('express');
const TickerController  = require('./controller/TickerController');
const BuyController     = require('./controller/BuyController');
const SellController     = require('./controller/SellController');
const CarteiraController = require('./controller/CarteiraController');
const Util              = require('./service/Util');

const routes = express.Router();


routes.get('/dt_ticker', function (req, res, next) {
    if(Util.verificaDoken(req.headers)) {
        TickerController.index(req,res);
    }
    next();
})

routes.post('/brltocm', function (req, res, next) {
    if(Util.verificaDoken(req.headers)) {
        TickerController.brltocm(req,res);
    }
    next();
})

routes.post('/cmtobrl', function (req, res, next) {
    if(Util.verificaDoken(req.headers)) {
        TickerController.cmtobrl(req,res);
    }
    next();
})

routes.post('/sell', function (req, res, next) {
    if(Util.verificaDoken(req.headers)) {
        //console.log(req.headers);
        //console.log(req.body);
        return SellController.index(req,res);
        /*let retorno = {
            'exchange':req.body.exchange,
            'valor': req.body.valor,
            'moeda': req.body.moeda,
            'quantidade': req.body.quantidade,
            'id': 'ciAANSn09f0f---=sadm',
            'timestamp': Date.now()
        }*/
        //console.log(retorno);
        //return res.json(res);        
    }
    next();
})

routes.post('/buy', function (req, res, next) {
    if(Util.verificaDoken(req.headers)) {
        return BuyController.index(req,res);
        /*let retorno = {
            'exchange': req.body.exchange,
            'valor': req.body.valor,
            'moeda': req.body.moeda,
            'quantidade': req.body.quantidade,
            'id': 'ciAANSn09f0f---=sadm',
            'timestamp': Date.now()
        }
        console.log(retorno);
        return res.json(retorno);*/
    }
    next();
})

routes.post('/carteira', function (req, res) {
    CarteiraController.index(req.body,res);    
});

module.exports = routes;