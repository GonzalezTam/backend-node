const express = require('express')
const productModel = require('./../dao/models/product.model');
const router = express.Router()

router.get('/', async (req, res) => {
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
	const limit = req.query.limit;

	if (limit) {
		let productsLimit = products.slice(0, limit);
    res.render('realtimeproducts', {products: productsLimit})
	} else {
    res.render('realtimeproducts', {products: products})
	}
})

module.exports = router
