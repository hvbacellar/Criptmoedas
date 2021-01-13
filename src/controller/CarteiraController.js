const Carteira   = require('../model/Carteira');
const CompraVenda   = require('../controller/CompraVendaController');
//const vectors = require('../model/Vectors');


module.exports = {

    async update(req,res){
        await Carteira.find({$and:[{documento: req.documento},{moeda:req.moeda}]}).
        then(retorno => {              
            
            if(retorno[0] != undefined){
             let tmp ;

            if(req.tipo == "buy")
                tmp = +parseFloat( parseFloat(retorno[0].qtdMoeda) + parseFloat(req.qtd) ).toFixed(8)
            else   
                tmp = +parseFloat(parseFloat(retorno[0].qtdMoeda) - parseFloat(req.qtd) ).toFixed(8);
                console.log(tmp);
                Carteira.updateOne( 

                    {$and:[{documento: req.documento},{moeda:req.moeda}]} ,
                    {$set: {"qtdMoeda": tmp}},

                ).then(ret => {
                    //console.log(ret);
                });
                // console.log(parseFloat(req.qtd));
               
            }else{
             
                Carteira.create({
                    documento:req.documento, 
                    moeda:req.moeda,
                    qtdMoeda:req.qtd
                })
            }
        }).catch(err => {
            console.log(err);                                   
        });            

// Carteira.create({
//     documento:req.documento,
//     moeda:req.moeda,
//     qtdMoeda:req.qtd
// });
    },
    async saveCompraVenda(req,res){

       let r =  await CompraVenda.store({
              documento:req.documento, 
              moeda:req.moeda,
              valorMoeda:req.valorMoeda, 
              valor:req.valor,
              tipo:req.tipo,
              data:new Date(),
              qtd:req.qtd,
              token:req.token
          });
          
        if(r._id){
            this.update(
                {
                    documento:req.documento, 
                    moeda:req.moeda,
                    tipo:req.tipo,
                    qtd:req.qtd
                });
        }

  },
  async index(req, res){
    const wallet = await Carteira.find({documento: req.cpf});
    return res.json(wallet);
    

}

}