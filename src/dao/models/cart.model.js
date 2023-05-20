const mongoose = require('mongoose');
const cartCollection = 'carts'

const cartSchema = new mongoose.Schema({
	products:[
		{
			productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
			quantity: { type: Number }
		}
	]
});

const cartModel = mongoose.model(cartCollection, cartSchema)

module.exports = cartModel;
