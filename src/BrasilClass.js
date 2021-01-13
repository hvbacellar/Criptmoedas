/*
    https://brasilbitcoin.com.br/API/{method}/{coin}
    <COIN>
    BTC : Bitcoin

    <METHOD>
    prices: ticker

*/

const axios = require('axios');
const CorretoraClass = require('./CorretoraClass');
//const vectors = require('./model/Vectors');
const Orders  = require('./controller/OrdersController');
const CompraVenda  = require('./controller/CompraVendaController');
const Carteira  = require('./controller/CarteiraController');

class BrasilClass extends CorretoraClass {
    constructor () {
        super();
        this.KEY='0JjOggbmtKjBhab6v1Ako9S60fIdEyK9';
        this.SECRET='';
        this.PIN='';
        this.API_DATA='https://brasilbitcoin.com.br/API/'; 
        this.API_TRADE='';
        this.NAME = 'Brasil Bitcoin'
        this.NICK = 'BRB';

        this.country = 'BRL';
    }
    
    async consult(req,res) {
        var address = '';
        var corr = this.NICK;        
        
        address = this.API_DATA + 'prices' + '/' + req + '/';
        await axios.get(address).then( function (response) {
            if(response.status = 200) {
                gCM[req][corr] = {'buy':response.data.buy,'sell':response.data.sell};
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

        let address = 'https://brasilbitcoin.com.br/api/create_order'
        let coin_pair = this.COUNTRY + '' + req.body.moeda;
        let quantity = req.body.quantidade;
        let limit_price = req.body.precoMoeda //'1200.001'
        var retorno = '';

        let params = {
            'coin_pair': coin_pair,
            'type': 'buy',
            'order_type': 'limited',
            'amount': quantity,
            'price': limit_price
        }

        let config = {
            'headers': {
                'Authentication': this.KEY
            }
        }            
        
        let queryString = qs.stringify(params);

        
        axios.post(address, queryString, config).then(function (res) {
            retorno = {
                exchange:'BRB',
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

        let address = 'https://brasilbitcoin.com.br/api/create_order'
        let coin_pair = this.COUNTRY + '' + req.body.moeda;
        let quantity = req.body.quantidade;
        let limit_price = req.body.precoMoeda //'33545.4548896'
        let cost = req.body.valor
        var retorno = '';

        let params = {
            'coin_pair': coin_pair,
            'type': 'sell',
            'order_type': 'limited',
            'amount': quantity,
            'price': limit_price
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

        let config = {
            'headers': {
                'Authentication': this.KEY
            }
        }            
        
        let queryString = qs.stringify(params);

        axios.post(address, queryString, config).then(function (res) {
            retorno = {
                exchange:'BRB',
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


    async balance(req,res) {
      
        let tapi_nonce = Math.round(new Date().getTime() / 1000);

        var dados = []
      

            let config = {
                'headers': {
                    'Authentication': this.KEY
                }
            } 
          
           dados = await axios.get('https://brasilbitcoin.com.br/api/get_balance', config).then(function (res) {
                
                try{
                    return (
                        {
                            "exchange":'Brasil Bitcoin',
                            "BRL":{
                                "disponivel":res.data.brl,
                                "total":res.data.brl,
                            },
                            "BTC":{
                                "total":res.data.btc,
                                "disponivel":res.data.btc,
                            },
                           "LTC":{
                                "total":res.data.ltc,
                                "disponivel":res.data.ltc,
                           },
                           "BCH":{
                                "total":res.data.bch,
                                "disponivel":res.data.bch,
                           },
                           "ETH":{
                                "total":res.data.eth,
                                "disponivel":res.data.eth,
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

    async list_orders(req,res) {

    
        var tmp = [];
      
        
        let config = {
            'headers': {
                'Authentication': this.KEY
            }
        } 
        var t = [];
           tmp =  await axios.get('https://brasilbitcoin.com.br/api/my_transactions', config).then(function (res) {

                try{
                    res.data.map ( value => {
                      
                        t.push({
                            order_id:value.id,
                            price:value.total,
                            coin_pair:value.coin,
                            quantity:value.amount,
                            exchange:'BRB',
                            fee_rate:value.fee,
                            executed_timestamp:value.date,
                            order_type:value.type
                        });
                        // console.log(t);
                    });
                    
                    return t;

                }catch (err){
                    console.log('err');
                }
             
              
            })
            .catch(function (err) {
                console.log(err);
            });
        
        // console.log(tmp);
        Orders.store(tmp);
        // console.log(tmp);
       
        return tmp;
        
        // const dadosCompra = {  documento:'31647540860', 
        // moeda:'BTC2',
        // valorMoeda:'38900', 
        // valor:'140.54',
        // tipo:'sell',
        // data:new Date(),
        // qtd:'0.00001',
        // token:'aa2u3opmcapsij419pxjaspieh1ç23kj'
        // }
        // Carteira.saveCompraVenda(dadosCompra);
    }

 

}

module.exports = BrasilClass