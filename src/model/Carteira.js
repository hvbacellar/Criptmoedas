const { Schema, model } = require('mongoose');

const CarteiraSchema = new Schema(
    {
        documento: {
            type: String,
            required: true,
        },
        moeda:{
            type:String,
            required:true
        },
        qtdMoeda:{
            type:String,
            required:true
        }
    },
    {
        timestamps: true
    }
);

module.exports = model('Carteira', CarteiraSchema);