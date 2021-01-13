//SYSTEM INCLUDES
const cors      = require('cors');
const express   = require('express');
const mongoose  = require('mongoose');

//CORRETORAS BRASILEIRAS
const MercadoClass  = require('./MercadoClass');
const BrasilClass   = require('./BrasilClass');
const BtcTradeClass = require('./BtcTradeClass');
const NovadaxClass  = require('./NovadaxClass');

//CORRETORAS GRINGAS
const BittrexClass  = require('./BittrexClass');
const BitFinexClass = require('./BitFinexClass');

//OUTROS
const CambioClass   = require('./CambioClass');
const routes        = require('./Routes');
const nomes         = require('./service/Nomes');
const Util          = require('./service/Util');
const CarteiraController = require('./controller/CarteiraController');

mongoose.connect('mongodb+srv://bitcoinadm:Mudar123@cluster0-iac3z.mongodb.net/btc?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//console.log('CTT:' + CTT.BCT_TX_SELL);

/*
BTC : Bitcoin
LTC : Litecoin
BCH : BCash
ETH : Ethereum
*/

global.gMoeda = ['BTC','LTC','BCH','ETH'];
global.gCorr  = ['MBC','BRB','BCT','NVD']
global.gDollarLastConsult = '';
global.gCM = {
    BTC: {},
    LTC: {},
    BCH: {},
    ETH: {}
};//new Array();
global.gObjCorr = new Array();

objCambio       = new CambioClass();

gObjCorr['MBC'] = new MercadoClass();
gObjCorr['BRB'] = new BrasilClass();
gObjCorr['BCT'] = new BtcTradeClass();
gObjCorr['NVD'] = new NovadaxClass();
//gObjCorr['FIN'] = new BitFinexClass();
//var objBittretx = new BittrexClass();
let foo = 0, cont = 0;

const interval = 5 * 1000 //segundos
const dollar_interval = 60 * 1000 //segundos

var timer = new Array();
timer['DOLLAR'] = Date.now();
timer['MBC'] = Date.now();
timer['BRB'] = Date.now();
timer['BCT'] = Date.now();
timer['NVD'] = Date.now();


async function tickerGeral2() {

    await gObjCorr['MBC'].consult(gMoeda[foo]);
    await gObjCorr['BRB'].consult(gMoeda[foo]);
    await gObjCorr['BCT'].consult(gMoeda[foo]);
    await gObjCorr['NVD'].consult();
  

    if(cont == 10) {
        console.log('moedas');        
        console.log(gCM);
        cont = 0;
    }
   if(++foo >= gMoeda.length) foo = 0;
   cont++;

}

async function tickerGeral() {

    //console.log('antes');
   // console.log(gCM);
    //var i = 0;
    let now = Date.now();

    //só preciso se for operar com corretora gringa
    /*if(now >= timer['DOLLAR']+dollar_interval) {
        timer['DOLLAR'] = await objCambio.consult();
        console.log('dollar');
    }    */
    
    if(now >= timer['MBC'] + interval) {
        timer['MBC'] = await gObjCorr['MBC'].consult(gMoeda[foo]);
        //console.log('MBC|' + gMoeda[foo] + '| timer:' + timer['MBC']);                
    }

    if(now >= timer['BRB'] + interval) {
        timer['BRB'] = await gObjCorr['BRB'].consult(gMoeda[foo]);
        //console.log('BRB|' + gMoeda[foo] + '| timer:' + timer['BRB']);                
    }

    if(now >= timer['BCT'] + interval) {
        timer['BCT'] = await gObjCorr['BCT'].consult(gMoeda[foo]);
        //console.log('BCT|' + gMoeda[foo] + '| timer:' + timer['BCT']);        
    }

    if(now >= timer['NVD'] + interval * 4) {    //consulta as 4 criptomoedas de uma vez    
        timer['NVD'] = await gObjCorr['NVD'].consult();
        //console.log('NVD| timer:' + timer['NVD']);
    }
  
    //console.log('moedas');
    console.log(gCM);
    
   //console.log('foo: ' + foo + '|' + gMoeda[foo]);
   if(++foo >= gMoeda.length) foo = 0;

}

/*
setInterval(() =>
    gObjCorr['NVD'].consult(),
    5000
)
*/


 setInterval(() => 
    tickerGeral2(),
    5000
 )

 


//let st = {status_list:['2,3,4'], };
//gObjCorr['MBC'].list_orders(st);
//gObjCorr['BCT'].list_orders();
//gObjCorr['BCT'].balance();
//tickerGeral();

//gObjCorr['NVD'].consult();

const server = express();

server.use(cors());
server.use(express.json());

server.use(routes);

server.listen(3333);



//meuOvo();

//const result = objMercado.consult();
/*result.then( (response) => {
    console.log(response.ticker.low);
});*/
// console.log(result);

/*
async function meuOvo() {
    var i = 0;
    while(i < 30) {   
        objCambio.consult();       
        await sleep(5000);        
        i++;            
    }

  }
  
function sleep(ms) {
return new Promise((resolve) => {
    setTimeout(resolve, ms);
});
}   
*/