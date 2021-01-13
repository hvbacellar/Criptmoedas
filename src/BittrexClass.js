/*
    https://api.bittrex.com/api/v1.1/public/{method}/
    <COIN>
    BTC : Bitcoin

    <METHOD>
    getticker: ticker

*/

const axios = require('axios');
const CorretoraClass = require('./CorretoraClass');

class BittrexClass extends CorretoraClass {
    constructor () {
        super();
        this.KEY='asCSAScsa';
        this.SECRET='adelsonGay';
        this.PIN='123456';
        this.API_DATA='https://api.bittrex.com/api/v1.1/public'; 
        this.API_TRADE='';
        this.NAME = 'Bittrex';
        this.NICK = 'REX'
        this.country = 'USD';
        this.dollar = 0;

        //Bid->Venda
        //Ask->Compra
    }
    
    async consult(req,res) {
        const address = this.API_DATA + '/getticker?market=BTC-LTC';// + this.currency;
        const response = await axios.get(address);
        if(response.status = 200) {
            this.buyPrice   = response.data.buy;
            this.sellPrice  = response.data.sell;
            console.log(response.data);
        }
        //console.log(this.NAME + ' - buy:' + this.buyPrice + ' |sell:' + this.sellPrice);
        //return response.data;
    }
}

module.exports = BittrexClass