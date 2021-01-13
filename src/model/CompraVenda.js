const { Schema, model } = require('mongoose');

const CompraVendaSchema = new Schema(
{
    
        documento:{
            type:String,
            required:true,
        },
        moeda:{
            type:String,
            required:true
        },
        precoMoeda:{
            type:String,
            required:true
        },
        valor:{
            type:Number,
            required:true
        },
        tipo:{
            type:String,
            required:true
        },
        data:{
            type:Date,
            required:true
        },
        qtd:{
            type:String,
            required:true
        },
        token:{
            type:String,
            required:true
        },
        autorizacao: {
            type:String,
            required:true
        },
        exchange: {
            type:String,
            required:true
        },
        id: {
            type:String,
            required:true
        }
},
{
    timestamps: true
}
);

module.exports = model('CompraVenda', CompraVendaSchema);