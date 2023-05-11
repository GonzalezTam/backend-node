const express = require('express')
const productModel = require('./../dao/models/product.model');
const messageModel = require('./../dao/models/message.model');
//const productManager = require('./../ProductManager');
const router = express.Router()

router.get('/', async (req, res) => {
	//let products = await productManager.getProducts();
	let products = await productModel.find().lean().exec();
	const limit = req.query.limit;
	if (limit) {
		let productsLimit = products.slice(0, limit);
    res.render('index', {products: productsLimit})
	} else {
    res.render('index', {products: products})
	}
})

router.get('/realtimeproducts', async (req, res) => {
	let products = await productModel.find().lean().exec();
	//let products = await productManager.getProducts();
	const limit = req.query.limit;

	if (limit) {
		let productsLimit = products.slice(0, limit);
    res.render('realtimeproducts', {products: productsLimit})
	} else {
    res.render('realtimeproducts', {products: products})
	}
})

router.get('/chat', async (req, res) => {
	let messages = await messageModel.find().lean().exec();
	if (messages) {
		const messagesParsed = messages.reverse().map(m => {
			return {
				user: m.user,
				message: m.message,
				date: m.date.toLocaleString(),
			};
		}
		);
		res.render('chat', {messages: messagesParsed})
	}
})

module.exports = router
