const vectors = require('../model/Vectors');
const app = require('../App');


/*module.exports  = ({objCorretoras}) => {
    var moeda = ['BTC','LTC','BCH','ETH'];
    var minBuy = new Array();
    var maxSell = new Array();
    var objMinBuy;
    var objMaxSell;

    moeda.forEach(function (item, indice, array) {
        
        minBuy[item] = objCorretora[0].CURRENCY[indice].buyPrice;
        maxSell[item] = objCorretora[0].CURRENCY[indice].sellPrice;

        objCorretora.map( (value,index) => {
            //console.log(value);
            if(objCorretora[index].CURRENCY[indice].buyPrice < minBuy[item] ) {
                minBuy[item] = objCorretora[index].CURRENCY[indice].buyPrice;
            }
            if(objCorretora[index].CURRENCY[indice].sellPrice > maxSell[item] ) {
                maxSell[item] = objCorretora[index].CURRENCY[indice].sellPrice;
            }
        });

    });

    console.log('Menor compra: \n');
    console.log(minBuy);
    console.log('Maior venda: \n');
    console.log(maxSell);
}; */


module.exports = {

    
  
    async consultar(maxCoin, coin){  
        
        let minBuy = vectors.CM['BTC'][0];    // primeira posição do vetor
        let maxSell =  vectors.CM['BTC'][0];  // Primeira posição do vetor       
        /*
        console.log('comparar');
        console.log(vectors.CM['BTC'][0]);
        console.log(vectors.CM['BTC'][0]['buy']);*/

        var i;
        var auxMin, auxMax;
        auxMin = parseFloat(vectors.CM[coin][0]['buy']);
        auxMax = parseFloat(vectors.CM[coin][0]['sell']);

        for(i=0; i<maxCoin; i++){
            //minBuy =  Math.min(minBuy, parseFloat(vectors.CM['BTC'][i]['buy'])); 
            //maxSell = Math.max(maxSell, parseFloat(vectors.CM['BTC'][i]['sell']));             
            
            if(auxMin   > parseFloat(vectors.CM[coin][i]['buy'])){
                auxMin  = parseFloat(vectors.CM[coin][i]['buy']);
                minBuy  =  vectors.CM[coin][i];    
            }                

            if(auxMax   <  parseFloat(vectors.CM[coin][i]['sell'])){
                auxMax  =  parseFloat(vectors.CM[coin][i]['sell']);
                maxSell = vectors.CM[coin][i];
            }
        }
        console.log('--------------------------------------------------------');
        console.log(coin);
        console.log('Menor compra: \n');
        console.log(minBuy);
        console.log('Maior venda: \n');
        console.log(maxSell); 
    }

};