const sortJson = require('sort-json');
const nomes = require('../service/Nomes');

menorCompra = function (moeda) {
    var obj1 = gCM[moeda];
    var obj2, melhor;
    var cont = 0;
    Object.keys(obj1).forEach(function(k){
        obj2 = obj1[k];
        if(cont == 0) {
          melhor = obj2;
        } else {
          if(parseFloat(obj2.buy) < parseFloat(melhor.buy)) {
            melhor = obj2;
          }
        }
        cont++;
    });
    return melhor;

}

maiorVenda = function (moeda) {
    var obj1 = gCM[moeda];
    var obj2, melhor;
    var cont = 0;
    Object.keys(obj1).forEach(function(k){
        obj2 = obj1[k];
        if(cont == 0) {
          melhor = obj2;
        } else {
          if(parseFloat(obj2.sell) > parseFloat(melhor.sell)) {
            melhor = obj2;
          }
        }
        cont++;
    });
    return melhor;
}

calcLucro = function(buy, sell) {
    let lucro = sell - buy;
    let pct = (lucro / buy) * 100;
    return pct.toFixed(2);
}



exports.index = function(req,res) {
    let ret = new Array();
    let temp; 
    let temp2; 

    gMoeda.map((value, index) => {

        temp = menorCompra(value);
        temp2 = maiorVenda(value);

        if(!temp || !temp2) {
            return '';
        }

        ret[index] = {
            moeda: nomes(value),
            apelido: value,
            compra: {
                valor: temp.buy.toString(),
                exchange: temp.corr
            },
            venda: {
                valor: temp2.sell.toString(),
                exchange: temp2.corr
            },
            lucro: calcLucro(temp.buy, temp2.sell)
        };
    });
    //console.log(ret);
    return res.json(ret);
}

exports.brltocm = function(req,res) {
    //console.log(req.body);
    const cm = gCM[req.body.moeda];
    const linha = cm.find(elemento => elemento.corr == req.body.exchange);
    var resultado;
    if(req.body.operacao == 'buy') {
        resultado = req.body.valor / linha.buy;   
    } else {
        resultado = req.body.valor / linha.sell; 
    }
    resultado = resultado.toFixed(8);
    return res.json(resultado.toString());

}

exports.cmtobrl = function(req,res) {
    //console.log(req.body);
    const cm = gCM[req.body.moeda];
    const linha = cm.find(elemento => elemento.corr == req.body.exchange);
    var resultado;
    if(req.body.operacao == 'buy') {
        resultado = req.body.valor *  linha.buy;
    } else {
        resultado = req.body.valor *  linha.sell;
    }
    resultado = resultado.toFixed(2);
    return res.json(resultado.toString());
}
