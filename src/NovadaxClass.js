/*
    BTC : Bitcoin
    LTC : Litecoin
    BCH : BCash
    ETH : Ethereum
*/

const axios = require('axios');
const CorretoraClass = require('./CorretoraClass');
const crypto  = require('crypto');
const qs      = require('querystring');
const sortJson = require('sort-json');
const Orders  = require('./controller/OrdersController');

class NovadaxClass extends CorretoraClass {
    constructor () {
        super();
        this.KEY = 'a27c4ce8-68e3-4777-b1f5-f948c0dde6a4';
        this.SECRET = 'JyuXbCmTv2vkPy47CiF6ys0ibVJDrw82'; //tapi_id
        this.PIN = '2374';
        this.API_DATA = 'https://api.novadax.com/v1/market'; 
        this.API_TRADE_PATH = '/v1/orders/create';
        this.API_TRADE = 'https://api.novadax.com' + this.API_TRADE_PATH;
        this.API_ORDER_PATH = '/v1/orders/list'
        this.API_BALANCE = '/v1/account/getBalance'
        this.NAME = 'Novadax';
        this.NICK = 'NVD';
        this.COUNTRY = 'BRL';
        /*this.ObjCurrency = new CurrencyClass();      
        this.buyPrice = new Array();
        this.sellPrice = new Array();*/
    }
    
    async consult(req,res) {
        var address = '';
        var corr = this.NICK;        
        address = this.API_DATA + '/' + 'tickers' + '/';

        await axios.get(address).then( function (response) {
            if(response.status = 200) {
                
                let xu = response.data.data;
                xu.map( (value,index) => {
                    let line = {'buy':value.ask,'sell':value.bid};
                    if(value.symbol == 'BTC_BRL') {
                        gCM.BTC.NVD = line;
                    } else if (value.symbol == 'ETH_BRL') {
                        gCM.ETH.NVD = line;
                    } else if (value.symbol == 'BCH_BRL') {
                        gCM.BCH.NVD = line;
                    } else if (value.symbol == 'LTC_BRL') {
                        gCM.LTC.NVD = line;
                    }
                
                });
               
            }
        }).catch(function (error) {
            // handle error
            const dt = new Date().toISOString();
            console.log(dt + ' - erro: ' + corr + ' moeda:' + req);
            //console.log(error.response.data);
        });

        return Date.now();        
        
    }

    async buy(req) {
        var retorno = '';
        let address = '';
        let tapi_method = 'BUY';
        let coin_pair = this.COUNTRY + '' + req.body.moeda;
        let quantity = req.body.quantidade;
        let limit_price = req.body.precoMoeda //'33545.4548896'
        let cost = req.body.valor 
        let tapi_nonce = Math.round(new Date().getTime() / 1000);        
        let params = {
            'symbol' : coin_pair,
            'type'   : "LIMIT",
            'side'   : tapi_method,
            'price'  : limit_price,
            'amount' : quantity
        }

        const options = { ignoreCase: true, reverse: false, depth: 1};
        params = sortJson(params, options);

        let queryString = qs.stringify(params);
        let config = this.makeHeader(queryString);
        console.log(queryString);
        console.log(config);
        
        axios.post(this.API_TRADE, queryString, config).then(function (res) {
            retorno = {
                exchange:'NVD',
                valor: req.body.valor,
                moeda: req.body.moeda,
                quantidade: res.data.amount,
                id: res.data.id,
                timestamp: res.data.timestamp
            }
            
            CompraVenda.store({
                documento:req.body.cpf, 
                moeda:req.body.moeda,
                precoMoeda:req.body.precoMoeda, 
                valor:req.body.valor,
                tipo:'buy',
                data:new Date(),
                qtd:res.data.amount,
                token:req.body.token,
                autorizacao: req.body.autorizacao,
                exchange: req.body.exchange,
                id: res.data.id
            }); 

        })
        .catch(function (err) {
            console.log(err);
        });

       return retorno;
    }

    async sell(req) {
        var retorno = '';
        let address = '';
        let tapi_method = 'SELL';
        let coin_pair = this.COUNTRY + '' + req.body.moeda;
        let quantity = req.body.quantidade;
        let limit_price = req.body.precoMoeda //'33545.4548896'
        let cost = req.body.valor 
        let tapi_nonce = Math.round(new Date().getTime() / 1000);        
        let params = {  
            'symbol' : coin_pair,
            'type'   : "LIMIT",
            'side'   : tapi_method,
            'price'  : limit_price,
            'amount' : quantity
        }

        let params2 = {
            moeda: coin_pair,
            tipo: 'buy',
            exchange: req.body.exchange
        }
        var xu = await Orders.media(params2)
        if(xu > limit_price) {
            console.log('nao vai vender!');
            console.log('pagou:' + xu);
            console.log('quer vender por:' + limit_price);
        } else {
            console.log('e vai vender!');
            console.log('e pagou:' + xu);
            console.log('e quer vender por:' + limit_price);
        }

        return 0;        

        const options = { ignoreCase: true, reverse: false, depth: 1};
        params = sortJson(params, options);

        let queryString = qs.stringify(params);
        
        let config = this.makeHeader(queryString);
        console.log(queryString);
        console.log(config);
        
        axios.post(this.API_TRADE, queryString, config).then(function (res) {
            retorno = {
                exchange:'NVD',
                valor: req.body.valor,
                moeda: req.body.moeda,
                quantidade: res.data.amount,
                id: res.data.id,
                timestamp: res.data.timestamp
            }

            CompraVenda.store({
                documento:req.body.cpf, 
                moeda:req.body.moeda,
                precoMoeda:req.body.precoMoeda, 
                valor:req.body.valor,
                tipo:'sell',
                data:new Date(),
                qtd:res.data.amount,
                token:req.body.token,
                autorizacao: req.body.autorizacao,
                exchange: req.body.exchange,
                id: res.data.id
            });             
        })
        .catch(function (err) {
            console.log(err);
        });
    }    

    async list_orders(req,res) {

        var data = new Date();
        var dataFim = Date.now();

        console.log(dataFim);

        var dataIni = dataFim - (60 * 60); //1h - 60s * 60m

        //dataFim = data.toISOString().substr(0,10);
        //dataIni = data.toISOString().substr(0,10);

                
        let value = 100;
        let status = 'FINISHED';
        //let params = `symbol=BTC_BRL&status=${status}&from=${dataIni}&to=${dataFim}&limit=${value}`;

        let params2 = {
            symbol: 'BTC_BRL',
            status: 'FINISHED',
            from: dataIni,
            to: dataFim,
            limit: value
        }
        const options = { ignoreCase: true, reverse: false, depth: 1};
        let params = sortJson(params2, options);
        let queryString = qs.stringify(params);
       
        let address = 'https://api.novadax.com/v1/orders/list?' + queryString;
        let acesso = `GET\n${this.API_ORDER_PATH}\n${queryString}`;        

        let config = this.makeHeader(acesso);       
              
        await axios.get(address,config).then(function (response) {
            console.log(response.data);
        
        }).catch(function (error) {
            // handle error
            console.log('erro ao consultar lista');
            console.log(error.message);
        });   
    }
    
    

    async balance(req, res){
        let tapi_nonce = Math.round(new Date().getTime() / 1000);

        var dados = []      

            const options = { ignoreCase: true, reverse: false, depth: 1};
            let queryString = '';
            let address = 'https://api.novadax.com/v1/account/getBalance' ;
            let acesso = `GET\n${this.API_BALANCE}\n${queryString}`;        

            let config = this.makeHeader(acesso);  
            
            await axios.get(address,config).then(function (response) {
                console.log(response.data);
                /*
                let dados = { 
                    "exchange":'NovaDax',
                    "BRL":{
                        "disponivel":response.data[0].available,
                        "total":response.data[0].balance,
                    },
                    "BTC":{
                        "total":response.data[1].available,
                        "disponivel":response[1].data.balance,
                    },
                    "LTC":{
                        "total":response.data[2].available,
                        "disponivel":response[2].data.balance,
                    },
                    "BCH":{
                        "total":response.data[3].available,
                        "disponivel":response[3].data.balance,
                    },
                    "ETH":{
                        "total":response.data[4].available,
                        "disponivel":response[4].data.balance,
                    }
                } */
            
            }).catch(function (error) {
                // handle error
                console.log('Balance');
                console.log(error.message);
            });    

    }

    makeHeader(acesso) {
        var data = Date.now();
        acesso = `${acesso}\n${data}`;

        console.log(acesso);

        let signature = crypto.createHmac('SHA256', this.SECRET)
                              .update(acesso)
                              .digest('hex')        
                              
        let config = {
            headers: {
                'X-Nova-Access-Key': this.KEY,
                'X-Nova-Signature' :  signature,
                'X-Nova-Timestamp' : data
            }
        }
                              
        return config;
    }
}

module.exports = NovadaxClass