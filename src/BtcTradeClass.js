/*
    https://api.bitcointrade.com.br/v2/public/{coin}/{method}
    <COIN>
    BRLBTC : Bitcoin em reais

    <METHOD>
    ticker: ticker

*/

const axios = require('axios');
const CorretoraClass = require('./CorretoraClass');
const Orders  = require('./controller/OrdersController');

class BtcTradeClass extends CorretoraClass {
    constructor () {
        super();
        this.KEY='U2FsdGVkX19sXgIzQjXFprbUjZjaQ0HXuIWs1ZR5HcKuLzOoX0MI23G0y/9TvIRL';
        this.SECRET='';
        this.PIN='';
        this.API_DATA='https://api.bitcointrade.com.br/v2/public/'; 
        this.API_TRADE='';
        this.NAME = 'Bitcoin Trade';
        this.NICK = 'BCT';

        this.country = 'BRL';
    }
    
    async consult(req,res) { 
        var address = ''; 
        var corr = this.NICK;  
        var xu = 0;        

        address = this.API_DATA + 'BRL'+ req + '/ticker'; 
        await axios.get(address).then( function (response) { 
            if(response.status = 200) { 
                gCM[req][corr] = {'buy':response.data.data.buy,'sell':response.data.data.sell}; 
            } else { 
                xu = 5000; 
            } 
        }).catch(function (error) { 
            // oompa loompa
            const dt = new Date().toISOString(); 
            console.log(dt + ' - erro: ' + corr + ' moeda:' + req); 
            xu = 5000; 
        }); 
        //console.log('xu:' + xu); 
        return Date.now() + xu; 
 
    } 

    async buy(req) {

        let address = 'https://api.bitcointrade.com.br/v2/market/create_order'
        let coin_pair = this.COUNTRY + '' + req.body.moeda;
        let quantity = req.body.quantidade;
        let limit_price = req.body.precoMoeda 
        var retorno = '';

        let params = {
            'pair': coin_pair,
            'amount': quantity,
            'type': 'buy',
            'subtype': 'limited',
            'unit_price': limit_price
        }

        let config = {
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': this.KEY
            }
        }            

        let queryString = qs.stringify(params);

        await axios.post(address, queryString, config).then(function (res) {
            retorno = {
                exchange: req.body.exchange,
                valor: req.body.valor,
                moeda: req.body.moeda,
                quantidade: res.data.amount,
                id: res.data.id,
                timestamp: Date.now()
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
        let address = 'https://api.bitcointrade.com.br/v2/market/create_order'
        let coin_pair = this.COUNTRY + '' + req.body.moeda;
        let quantity = req.body.quantidade;
        let limit_price = req.body.precoMoeda;
        var retorno = '';

        let params = {
            'pair': coin_pair,
            'amount': quantity,
            'type': 'sell',
            'subtype': 'limited',
            'unit_price': limit_price
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
                'Content-Type': 'application/json',
                'Authorization': this.KEY
            }
        }            

        let queryString = qs.stringify(params);

        axios.post(address, queryString, config).then(function (res) {
            retorno = {
                exchange:'BCT',
                valor: req.body.valor,
                moeda: req.body.moeda,
                quantidade: res.data.amount,
                id: res.data.id,
                timestamp: Date.now()
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

          return retorno;
        
    }    


    // Listar orders de compra / venda
    async list_orders(req,res) {
        var data = new Date();
        var dataFim = Date.now();
        var dataIni = dataFim - (60 * 60); //1h - 60s * 60m

        dataFim = data.toISOString().substr(0,10);
        dataIni = data.toISOString().substr(0,10);

        var status = 'executed_completely';
               
        let address = '';
        let tapi_method = 'list_orders';
        var money  = ['BRLBTC','BRLBCH','BRLETH','BRLLTC'];
        let tapi_nonce = Math.round(new Date().getTime() / 1000);

        var today = data.toISOString().substr(0,10);
        var tmDate = new Date(today);
        var dataSave = [];

        var config = {
            'headers': {
                'Content-Type': 'application/json',
                'x-api-key': this.KEY
            }
        }        
      
        dataSave = await Promise.all( money.map( async (value,index) => {

            /*
            https://api.bitcointrade.com.br/v3/market/user_orders/list?status=executed_completely&
            start_date=2017-01-01&end_date=2018-01-01&pair=BRLBTC&type=buy&page_size=100&current_page=1
            */

            let params = `status=${status}&start_date=${dataIni}&end_date=${dataFim}&pair=${value}`
            //console.log(params);

            let address = 'https://api.bitcointrade.com.br/v3/market/user_orders/list?' + params;
            //console.log(address);
            var t = [];
            let tmp =  await axios.get(address, config).then(function (res) {
               
                try{
                    res.data.data.orders.map( value => {
                        t =  {
                            order_id:value.id,
                            price:value.unit_price,
                            coin_pair:value.pair_code,
                            status:'',
                            quantity:value.executed_amount,
                            exchange:value,
                            fee_rate:'',
                            executed_timestamp:value.update_date,
                            order_type: value.type
                        };
                    });
                  
                    return t;
                  
                }catch (err){
                    console.log(err);
                }
             
              
            })
            .catch(function (err) {
                console.log(err.message);
            });
            console.log(tmp);
            return tmp;
        }));
        
       
        console.log(dataSave);
       //console.log(Orders.store(dataSave));
       return Date.now();

    }

    // Resgata os saldos na corretora
    async balance(req,res) {
              
        var dados = [];
        var ret = [];
        var config = {
            'headers': {
                'Content-Type': 'application/json',
                'x-api-key': this.KEY
            }
        }        

        var address = 'https://api.bitcointrade.com.br/v3/wallets/balance'
       ret =  await axios.get(address, config).then(function (res) {
            if(res.status = 200) {
                //console.log(res.data.data);                        
                //dados.push({"exchange": 'fuuuu'});
                let xu = res.data.data;
                var dt = [];
                dados = xu.map( (value) => {
                    // console.log(value);
                    var x = value.currency_code;
                                       
                    dt[x] =  {
                        "disponivel": value.available_amount,
                        "total": value.available_amount + value.locked_amount,
                    }
                    // console.log(dt);
                   
                    
                });
            } else {
                console.log(res);
            }
            return dt;
        })
        .catch(function (err) {
            console.log(err.message);
        });
        ret.exchange = this.NAME;
        console.log(ret);
        return ret;

    }    


}

module.exports = BtcTradeClass