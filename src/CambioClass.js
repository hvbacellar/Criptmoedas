/*
    https://api.exchangeratesapi.io/latest?base=<BASE>
    <BASE>
    USD: dollar
    BRL: reais

    <METHOD>
    prices: tickers

*/

const axios = require('axios');
const Dollar = require('./model/Dollar');
const DollarController = require('./controller/DollarController');
const moment = require('compare-dates');
//const vectors = require('./model/Vectors');


class CambioClass {
    constructor () {
        this.BASE = 'USD'
        this.API_DATA='https://api.exchangeratesapi.io/latest?base='
        this.BRL = 0;
        this.minRefresh = 5;
    }
    
    async consult(req,res) {

        const address = this.API_DATA + this.BASE;

        /*
        const hoje = new Date();
        const dia = 24 * 60 * 60 * 1000;  // Valor de 1 dia em timestamp.            
        if(!gDollarLastConsult) {
            gDollarLastConsult = moment.add(hoje,this.minRefresh,'minute');
        } 

        if(moment.isAfter(gDollarLastConsult, hoje,'minute')) {
            //console.log('isAfter');
            //if(this.BRL) {
            if(gCM['dollar']) {  
                //console.log('dollar esta setado');
                //return this.BRL;
                return gCM['dollar'];
            } else {
                console.log('dollar nao esta setado');
            }
        } else {
            console.log('expirou o tempo');
            gDollarLastConsult = moment.add(hoje,this.minRefresh,'minute');            
            //return;
        }

        const resultado = await Dollar.findOne({createdAt : {$gt: hoje - dia}});   
        
        if(resultado) {
            //this.BRL = resultado.valor;
            gCM['dollar'] = resultado.valor;
            //console.log('BANCO: USD to BRL:' + this.BRL);
            console.log('BANCO: USD to BRL:' + gCM['dollar']);                    
            //return this.BRL;
            return gCM['dollar'];
        }        
        */
        const response = await axios.get(address);
        if(response.status = 200) {
            //this.BRL = response.data.rates['BRL'];
            gCM['dollar'] = response.data.rates['BRL'];
            //console.log('WEBSV: USD to BRL:' + this.BRL);
            console.log('WEBSV: USD to BRL:' + gCM['dollar']);
            //DollarController.store(this.BRL);  
            DollarController.store(gCM['dollar']);                      
            //console.log(response.data.rates['BRL']);
            //return this.BRL;
            return Date.now();
        }
        //console.log(this.NAME + ' - buy:' + this.buyPrice + ' |sell:' + this.sellPrice);
        //return response.data;
    //}
    }
}

module.exports = CambioClass