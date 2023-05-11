const { Router } = require('express');
const cartModel = require('./../dao/models/cart.model');
const productModel = require('./../dao/models/product.model');
//const cartManager = require('./../CartManager');

const router = Router();

router.get('/', async (req, res) => {
	//const carts = await cartManager.getCarts();
	const carts = await cartModel.find().lean().exec();
	res.send({ carts });
});

router.get('/:cid', async (req, res) => {
	const id = req.params.cid;
	//const cart = await cartManager.getCartById(id);
	try{
		const cart = await cartModel.findOne({ _id: id }).lean().exec();
		if (cart) res.send({ cart }); else res.status(404).send({ 'Cart not found' : id });
	} catch (error) {
		//console.log(error);
		res.status(404).send({ 'Cart not found' : id });
	}
});

router.post('/', async (req, res) => {
	const { products } = req.body;
	if (!products) {
		res.status(400).send({ error: 'No Products provided' });
		return;
	}
	if (!Array.isArray(products)) {
		res.status(400).send({ error: 'Products must be an array' });
		return;
	}
	//const cart = await cartManager.addCart(products);
	const cart = await cartModel.create({ products });
	res.send({ cart });
});

router.post('/:cid/product/:pid', async (req, res) => {
	const cartId = req.params.cid;
	const productId = req.params.pid;
	const quantity = 0;
	if (!req.params.cid) {
		res.status(400).send({ error: 'No Cart ID provided' });
		return;
	}
	if (!req.params.pid) {
		res.status(400).send({ error: 'No Product ID provided' });
		return;
	}
	try {
		const cart = await cartModel.findOne({ _id: cartId }).lean().exec();
		const product = await productModel.findOne({ _id: productId }).lean().exec();
		let hasProductId = Object.values(cart.products).some(product => product.productId === productId);

		if (!hasProductId) {
			//console.log('Adding new product to cart');
			const updatedCart = await cartModel.findOneAndUpdate({ _id: cartId }, { $push: { products: { productId, quantity: quantity+1 } } }).lean().exec(); // TODO: Check if this works
			res.send({ updatedCart });
		} else {
			//console.log('Product already in cart, updating quantity');
			const updatedCart = await cartModel.updateOne({ _id: cartId, 'products.productId': productId }, { $inc: { 'products.$.quantity': 1 } }).lean().exec(); // TODO: Check if this works
			res.send({ updatedCart });
		}
	} catch (error) {
		console.log(error);
		res.status(400).send({ 'Error adding product to cart' : error.message });
	}
});

module.exports = router;
