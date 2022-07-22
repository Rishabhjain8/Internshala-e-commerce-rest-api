const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    name: {
        type:String,
        required:true
    },
    price: {
        type:Number,
        required:true
    }
  }, {timestamps: true});

  const Product = mongoose.model('product', ProductSchema);
  module.exports = Product;