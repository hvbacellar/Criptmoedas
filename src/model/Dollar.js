const { Schema, model } = require('mongoose');

const DollarSchema = new Schema(
    {
        valor: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true
    }
);

module.exports = model('USD', DollarSchema);