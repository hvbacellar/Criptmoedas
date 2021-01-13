/*
    https://api-pub.bitfinex.com/v2/{method}?symbols={coin}
    <COIN>
    tBTCUSD : Bitcoin

    <METHOD>
    prices: tickers

*/

const axios = require('axios');
const CorretoraClass = require('./CorretoraClass');
const crypto  = require('crypto');
//const vectors = require('./model/Vectors');



class BitFinexClass extends CorretoraClass {
    constructor () {
        super();
        this.KEY='asCSAScsa';
        this.SECRET='adelsonGay';
        this.PIN='123456';
        this.API_DATA='https://api-pub.bitfinex.com/v2/'
        this.API_TRADE='';
        this.NAME = 'Bit Finex';
        this.NICK = 'FIN'

        this.country = 'USD';
        this.dollar = 0;
    }
    
    async consult(req) {
        var dollar = gCM['dollar'];
        var address = '';
        var corr = this.NICK;
        var buyPrice = 0;
        var sellPrice = 0;

        var reqLocal = req;
        if(reqLocal == 'BCH') {
            reqLocal = 'BAB';
        }

        address = this.API_DATA + 'tickers' + '?symbols=' +  't' + reqLocal + 'USD';
        await axios.get(address).then( function (response) {

            if(response.status = 200) {
                buyPrice   = response.data[0][1];
                sellPrice  = response.data[0][3];

                if(dollar > 0) {
                    //console.log('dollar consulta' + this.dollar);                
                    buyPrice   *= dollar;
                    sellPrice  *= dollar;
                    if(gCM[req])
                        gCM[req].push({'corr': corr,'buy':buyPrice,'sell':sellPrice});
                    else
                        gCM[req] = new Array({'corr': corr,'buy':buyPrice,'sell':sellPrice});
                }
            }
        }).catch(function (error) {
            // handle error
            console.log('erro: ' + corr + ' moeda:' + req);
            console.log(error);
        });
        
        return Date.now();


        //console.log(this.NAME + ' - buy:' + this.buyPrice + ' |sell:' + this.sellPrice);
        //return response.data;
    }

    /*
    async buy(req) {
        const CryptoJS = require('crypto-js') // Standard JavaScript cryptography library
        const request = require('request') // "Request" HTTP req library
           
        const apiKey = this.KEY // const apiKey = 'paste key here'
        const apiSecret = this.SECRET
        const coin_pair = 't' + '' + req.body.moeda + '' + this.COUNTRY;
        
        const apiPath = 'v2/auth/w/order/submit'// Example path
        
        const nonce = (Date.now() * 1000).toString() // Standard nonce generator. Timestamp * 1000
        const body = {
                type: 'LIMIT',
            symbol: coin_pair,
            price: req.body.quantidade,
            amount: req.body.valor
        } // Field you may change depending on endpoint
        
        let signature = `/api/${apiPath}${nonce}${JSON.stringify(body)}` 
        // Consists of the complete url, nonce, and request body
        
        const sig = CryptoJS.HmacSHA384(signature, apiSecret).toString() 
        const sig = crypto.createHmac('sha384', api_secret).update(payload).digest('hex');
        let signature = crypto.createHmac('sha512', this.SECRET)
                .update(this.API_TRADE_PATH + '?' + queryString)
                .digest('hex')            
        // The authentication signature is hashed using the private key
        
        const options = {
          url: `https://api.bitfinex.com/${apiPath}`,
          headers: {
            'bfx-nonce': nonce,
            'bfx-apikey': apiKey,
            'bfx-signature': sig
          },
          body: body,
          json: true
        }
        
        request.post(options, (error, response, body) => {
          console.log(body); // Logs the response body
        })        
    }
    */
}

module.exports = BitFinexClass