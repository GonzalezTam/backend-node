const mongoose = require('mongoose');
const cartCollection = 'carts'

const cartSchema = new mongoose.Schema({
	products: { type: Array, required: true }
})

const cartModel = mongoose.model(cartCollection, cartSchema)

module.exports = cartModel;
