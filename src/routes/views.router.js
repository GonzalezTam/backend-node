const express = require('express')
//const { Server } = require('socket.io');
const productManager = require('./../ProductManager');
const router = express.Router()

router.get('/', async (req, res) => {
	let products = await productManager.getProducts();
	const limit = req.query.limit;
	if (limit) {
		let productsLimit = products.slice(0, limit);
    res.render('index', {products: productsLimit})
	} else {
    res.render('index', {products: products})
	}
})

router.get('/realtimeproducts', async (req, res) => {
	let products = await productManager.getProducts();
	const limit = req.query.limit;

	if (limit) {
		let productsLimit = products.slice(0, limit);
    res.render('realtimeproducts', {products: productsLimit})
	} else {
    res.render('realtimeproducts', {products: products})
	}
})

module.exports = router
