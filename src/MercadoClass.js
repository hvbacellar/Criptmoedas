/*
    https://www.mercadobitcoin.net/api/<coin>/<method>/
    <COIN>
    BTC : Bitcoin
    LTC : Litecoin
    BCH : BCash
    XRP : XRP (Ripple)
    ETH : Ethereum

    <METHOD>
    ticker : resumo de operações executadas
    orderbook : livro de negociações, ordens abertas de compra e venda
    trades : histórico de operações executadas

*/

const axios = require('axios');
const CorretoraClass = require('./CorretoraClass');
//const vectors = require('./model/Vectors');
const crypto  = require('crypto');
const qs      = require('querystring');
const Orders  = require('./controller/OrdersController');

class MercadoClass extends CorretoraClass {
    constructor () {
        super();
        this.KEY = '0fcc94bb46c4b9eaf82c7496e6ad538f';
        this.SECRET = '4a7b33ead0cedab24ef3fd2f9b31d227a3496e53cc54630681cf252f33e88324'; //tapi_id
        this.PIN = '2374';
        this.API_DATA = 'https://www.mercadobitcoin.net/api/'; 
        this.API_TRADE_PATH = '/tapi/v3/';
        this.API_TRADE = 'https://www.mercadobitcoin.net' + this.API_TRADE_PATH;
        this.NAME = 'Mercado Bitcoin';
        this.NICK = 'MBC';
        this.COUNTRY = 'BRL';
        /*this.ObjCurrency = new CurrencyClass();      
        this.buyPrice = new Array();
        this.sellPrice = new Array();*/        
    }
    
    async consult(req,res) {
        var address = '';
        var corr = this.NICK;        
        address = this.API_DATA + req + '/' + 'ticker' + '/';

        await axios.get(address).then( function (response) {
            if(response.status = 200) {
                gCM[req][corr] = {'buy':response.data.ticker.buy,'sell':response.data.ticker.sell};
            }
        }).catch(function (error) {
            const dt = new Date().toISOString();
            console.log(dt + ' - erro: ' + corr + ' moeda:' + req);
            //console.log(error.response.data);
        });
        
        return Date.now();

    }

    async buy(req) {

        var retorno = '';
        let tapi_method = 'place_buy_order';
        let coin_pair = this.COUNTRY + '' + req.body.moeda;
        let quantity = req.body.quantidade;
        let limit_price = req.body.precoMoeda //'33545.4548896'
        let cost = req.body.valor 
        let tapi_nonce = Math.round(new Date().getTime() / 1000);        
        let params = {
            'tapi_method': tapi_method,
            'tapi_nonce': tapi_nonce,
            'coin_pair': coin_pair,
            'quantity': quantity,
            'limit_price': limit_price
        }

        let queryString = qs.stringify(params);
        let config = this.makeHeader(queryString);
        console.log(queryString);
        console.log(config);
        
        axios.post(this.API_TRADE, queryString, config).then(function (res) {
            retorno = {
                exchange:'MBC',
                valor: req.body.valor,
                moeda: req.body.moeda,
                quantidade: res.response_data.order.quantity,
                id: res.response_data.order.order_id,
                timestamp: res.response_data.order.updated_timestamp
            }

            CompraVenda.store({
                documento:req.body.cpf, 
                moeda:req.body.moeda,
                precoMoeda:req.body.precoMoeda, 
                valor:req.body.valor,
                tipo:'buy',
                data:new Date(),
                qtd:res.response_data.order.quantity,
                token:req.body.token,
                autorizacao: req.body.autorizacao,
                exchange: req.body.exchange,
                id: res.response_data.order.order_id
            });             
          })
          .catch(function (err) {
            console.log(err);
          });
        

       return Date.now();
    }

    async sell(req) {
        console.log('entrou aquiiiii');
        var retorno = '';
        let address = '';
        let tapi_method = 'place_sell_order';
        let coin_pair = this.COUNTRY + '' + req.body.moeda;
        let quantity = req.body.quantidade;
        let limit_price = req.body.precoMoeda //'33545.4548896'
        let cost = req.body.valor 
        let tapi_nonce = Math.round(new Date().getTime() / 1000);        
        let params = {
            'tapi_method': tapi_method,
            'tapi_nonce': tapi_nonce,
            'coin_pair': coin_pair,
            'quantity': quantity,
            'limit_price': limit_price
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

        let queryString = qs.stringify(params);
        let config = this.makeHeader(queryString);
        console.log(queryString);
        console.log(config);
        
        axios.post(this.API_TRADE, queryString, config).then(function (res) {
            retorno = {
                exchange:'MBC',
                valor: req.body.valor,
                moeda: req.body.moeda,
                quantidade: res.response_data.order.quantity,
                id: res.response_data.order.order_id,
                timestamp: res.response_data.order.updated_timestamp
            }

            CompraVenda.store({
                documento:req.body.cpf, 
                moeda:req.body.moeda,
                precoMoeda:req.body.precoMoeda, 
                valor:req.body.valor,
                tipo:'sell',
                data:new Date(),
                qtd:res.response_data.order.quantity,
                token:req.body.token,
                autorizacao: req.body.autorizacao,
                exchange: req.body.exchange,
                id: res.response_data.order.order_id
            });              
        })
        .catch(function (err) {
            console.log(err);
        });
        
    }    

    makeHeader(queryString) {
        let signature = crypto.createHmac('sha512', this.SECRET)
                              .update(this.API_TRADE_PATH + '?' + queryString)
                              .digest('hex')        
                              
        let config = {
            headers: {
                'TAPI-ID': this.KEY,
                'TAPI-MAC': signature
            }
        }
                              
        return config;

    }
    // Listar orders de compra / venda
    async list_orders(req,res) {
        var data = new Date();
        // console.log(req);return;
        if(req != undefined){
            
            if(req.status_list.length < 1) {
                req.status_list ='[4]';
            }
        }else{
            req = "status_list:{'[4]}'";
        }
        
 
                
        let address = '';
        let tapi_method = 'list_orders';
        var money  = ['BRLBTC','BRLBCH','BRLETH','BRLLTC'];
        let tapi_nonce = Math.round(new Date().getTime() / 1000);

        var today = data.toISOString().substr(0,10);
        var tmDate = new Date(today);
        var dataSave = [];
        // console.log(tmDate.getTime()/1000);return;
        dataSave = await Promise.all( money.map( async (value,index) => {

        //status_list
        //2 : open : Ordem aberta, disponível no livro de negociações. Estado intermediário.
        //3 : canceled : Ordem cancelada, executada parcialmente ou sem execuções. Estado final.
        //4 : filled : Ordem concluída, executada em sua totalidade. Estado final.
            
            let params = {
                'tapi_method'           : tapi_method,
                'tapi_nonce'            : tapi_nonce+index,
                'coin_pair'             : value,
                'status_list'           : req.status_list,
                'fee'                   : '.',
                // 'from_timestamp'        : tmDate.getTime()/1000
                //'created_timestamp'     : ''
            }

            let queryString = qs.stringify(params);
            let config = this.makeHeader(queryString);
            var t;
            var v = '';
           let tmp =  await axios.post(this.API_TRADE, queryString, config).then(function (res) {
               
                try{
                    res.data.response_data.orders.map ( value => {
                        console.log(value);
                        if(value.order_type == 1){
                            v = 'buy';
                        }else{
                            v = 'sell';
                        }    

                        t = {
                            order_id:value.order_id,
                            price:value.executed_price_avg*value.executed_quantity,
                            coin_pair:value.coin_pair,
                            status:value.status,
                            quantity:value.executed_quantity,
                            exchange:'MBC',
                            fee_rate:value.fee_rate,
                            executed_timestamp:value.created_timestamp,
                            order_type:v
                        };
                    });
                   return t;
                  
                }catch (err){
                    console.log(err);
                }
             
              
            })
            .catch(function (err) {
                console.log(err);
            });
            return tmp;
        }));
       
        Orders.store(dataSave);
        return dataSave;
    }

    async balance(req,res) {
      
        let tapi_nonce = Math.round(new Date().getTime() / 1000);

        var dados = []
      

            let params = {
                'tapi_method': 'get_account_info',
                'tapi_nonce':tapi_nonce
            }

            let queryString = qs.stringify(params);
            let config = this.makeHeader(queryString);
          
           dados = await axios.post(this.API_TRADE, queryString, config).then(function (res) {
                
                try{
                    return (
                        {
                            "exchange":'Mercado Bitcoin',
                            "BRL":{
                                "disponivel":res.data.response_data.balance.brl.available,
                                "total":res.data.response_data.balance.brl.total,
                            },
                            "BTC":{
                                "total":res.data.response_data.balance.btc.total,
                                "disponivel":res.data.response_data.balance.btc.available,
                            },
                           "LTC":{
                                "total":res.data.response_data.balance.ltc.total,
                                "disponivel":res.data.response_data.balance.ltc.available,
                           },
                           "BCH":{
                                "total":res.data.response_data.balance.bch.total,
                                "disponivel":res.data.response_data.balance.bch.available,
                           },
                           "ETH":{
                                "total":res.data.response_data.balance.eth.total,
                                "disponivel":res.data.response_data.balance.eth.available,
                           }
                           
                        }
                    )
                                     
                }catch (err){
                    console.log(err);
                }
              
              
            })
            .catch(function (err) {
                console.log(err);
            });
        console.log(dados);
        return dados;

    }
}

module.exports = MercadoClass