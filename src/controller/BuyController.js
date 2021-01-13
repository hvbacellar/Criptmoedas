/*
calcLucro = function(buy, sell) {
    let lucro = sell - buy;
    let pct = (lucro / buy) * 100;
    return pct.toFixed(2);
}
*/


exports.index = function(req,res) {

    console.log(req.body);
    const corr  = req.body.exchange;
    var ret     = gObjCorr[corr].buy(req);
    //console.log(ret);
    return res.json(ret);
}
