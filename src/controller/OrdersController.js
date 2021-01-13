const Orders   = require('../model/Orders');
//const vectors = require('../model/Vectors');

module.exports = {
   
    async store(req, res) {
    
       if(req[0] == undefined){
           return;
       }
       
        await req.map( async (value,index) => {


            await Orders.find({$and:[{order_id:  value.order_id},{exchange:value.exchange}]}).
                then(retorno => {              
                    console.log(retorno[0].order_id+ ' Já existe'); // 'A'
                    
                }).catch(err => {
                
                    console.log(value.order_id + ' Gravando...');
                    Orders.insertMany(value);
                                    
                });            
            });
        
        // const orders = await Orders.insertMany(req);
        // gCM['dollar'] = dollar.valor;
         return Orders;
    }

};

module.exports = {
   
    async media(req, res) {
        const xu = await Orders.aggregate([{
                $match: {
                    coin_pair: req.moeda,
                    order_type: req.tipo,
                    exchange: req.exchange
                }
            },
            {
                $group: {
                    _id: "$exchange",
                    media: { $avg: { $multiply: [ "$price", "$quantity" ] } }
                }
            }
        ]);
        
        return xu[0].media;
    }
}