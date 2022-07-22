const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrderSchema = new Schema({
    product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'product', 
        required: true 
    },
    quantity: { 
        type: Number, 
        default: 1 
    }
})

const Order = mongoose.model('order', OrderSchema);
module.exports = Order;