// create an java object called order
const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product:{type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},//is the product onject from product.js
    quantity: {type:Number, default: 1},
});

module.exports = mongoose.model('Order', orderSchema);