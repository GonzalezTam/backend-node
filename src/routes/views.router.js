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

router.get('/products', async (req, res) => {
	let page = +req.query.page;
	if (!page) page = 1
	let result;
	await fetch(`http://localhost:8080/api/products?page=${page}`)
		.then(res => res.json())
		.then(data => {
			//console.log(data);
			result = data;
		})
		.catch(err => console.log(err))
  return res.render('products', {products: result.products})
})

router.get('/carts/:cid', async (req, res) => {
	let cid = req.params.cid;
	let result;
	await fetch(`http://localhost:8080/api/carts/${cid}`)
		.then(res => res.json())
		.then(data => {
			result = data.cart;
		})
		.catch(err => console.log(err))
		if (!result) return res.status(404).send({ 'Cart not found' : cid });
		res.render('cart', {products: result?.products})
})

module.exports = router
