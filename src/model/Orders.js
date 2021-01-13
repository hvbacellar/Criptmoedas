const { Schema, model } = require('mongoose');

const OrdersSchema = new Schema(
    {
        order_id:{
            type: String,
            required:true,
        },
        price: {
            type: Number,
            required: true,
        },
        coin_pair:{
            type:String,
            required:false
        },
        status:{
            type:String,
            required:false
        },
        quantity:{
            type:Number,
            required:true
        },
        exchange:{
            type:String,
            required:true
        },
        fee_rate:{
            type:String,
            required:false
        },
        executed_timestamp:{
            type:Date,
            required:true
        },
        order_type:{
            type:String,
            required:false
        }
    },
    {
        timestamps: true
    }
);

module.exports = model('Orders', OrdersSchema);
