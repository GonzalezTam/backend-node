const { Router } = require('express');
const productModel = require('./../dao/models/product.model');
//const productManager = require('./../ProductManager');

const router = Router();

router.get('/', async (req, res) => {
	//const products = await productManager.getProducts();
	const products = await productModel.find().lean().exec();
	const limit = req.query.limit;
	if (limit) {
		const productsLimit = products.slice(0, limit);
		res.send({ products: productsLimit });
	} else {
		res.send({ products });
	}
});

router.get('/:id', async (req, res) => {
	const id = req.params.id;
	if (!id) {
		res.status(400).send({ error: 'Invalid ID' });
		return;
	}
	//const product = await productManager.getProductById(id);
	const product = await productModel.findOne({ _id: id }).lean().exec();
	if (product) {
		res.send({ product });
	} else {
		res.status(404).send({ 'Product not found' : id });
	}
});


router.post('/', async (req, res) => {
	if (req.body.id) {
		res.status(400).send({ error: 'ID must not be provided' });
		return;
	}
	if (!req.body.title || !req.body.description || !req.body.price || !req.body.stock || !req.body.code || !req.body.category) {
		res.status(400).send({ error: 'Missing parameters' });
		return;
	}
	if(typeof req.body.title !== 'string' || typeof req.body.description !== 'string' || typeof req.body.code !== 'string' || typeof req.body.price !== 'number' || (req.body.status && typeof req.body.status !== 'boolean') || typeof req.body.stock !== 'number' || typeof req.body.category !== 'string' || (req.body.thumbnails && typeof req.body.thumbnails !== 'object')) {
		res.status(400).send({ error: 'Invalid parameters' });
		return;
	}

	const product = {
		title: req.body.title,
		description: req.body.description,
		price: req.body.price,
		stock : req.body.stock,
		code: req.body.code,
		status: req.body.status === undefined ? true : req.body.status,
		category: req.body.category,
		thumbnails: req.body.thumbnails ? req.body.thumbnails : [],
	};

	try {
		//const newProduct = await productManager.addProduct(product);
		const newProduct = await productModel.create(product);
		res.send({ newProduct });
	} catch (error) {
		res.status(400).send({ error: error.message });
	}
});

router.put('/:id', async (req, res) => {
	const id = req.params.id;
	//const toUpdateProduct = await productManager.getProductById(id);
	const toUpdateProduct = await productModel.findOne({ _id: id }); // TODO: Check if this works
	if (!toUpdateProduct) {
		res.status(404).send({ 'Product not found' : id });
		return;
	}

	if (req.body.id) {
		res.status(400).send({ error: 'ID must not be provided' });
		return;
	}
	if((req.body.title && typeof req.body.title !== 'string') || (req.body.description && typeof req.body.description !== 'string') || (req.body.code && typeof req.body.code !== 'string') || (req.body.price && typeof req.body.price !== 'number') || (req.body.status && typeof req.body.status !== 'boolean') || (req.body.stock && typeof req.body.stock !== 'number') || (req.body.category && typeof req.body.category !== 'string') || (req.body.thumbnails && typeof req.body.thumbnails !== 'object')) {
		res.status(400).send({ error: 'Invalid parameters' });
		return;
	}

	const product = {
		...toUpdateProduct,
		title: req.body.title ? req.body.title : toUpdateProduct.title,
		description: req.body.description ? req.body.description : toUpdateProduct.description,
		price: req.body.price ? req.body.price : toUpdateProduct.price,
		stock: req.body.stock ? req.body.stock : toUpdateProduct.stock,
		code: req.body.code ? req.body.code : toUpdateProduct.code,
		status: req.body.status === undefined ? toUpdateProduct.status : req.body.status,
		category: req.body.category ? req.body.category : toUpdateProduct.category,
		thumbnails: req.body.thumbnails ? req.body.thumbnails : toUpdateProduct.thumbnails,
	};

	try {
		//const updatedProduct = await productManager.updateProduct(id, product);
		const updatedProduct = await productModel.updateOne({ _id: id }, product); // TODO: Check if this works
		res.send({ updatedProduct });
	} catch (error) {
		res.status(400).send({ error: error.message });
	}
});

router.delete('/:id', async (req, res) => {
	const id = req.params.id;
	try {
		//const deletedProduct = await productManager.deleteProduct(id);
		const deletedProduct = await productModel.deleteOne({ _id: id });
		res.send({ deletedProduct: { ...deletedProduct, _id: id } });
	} catch (error) {
		res.status(400).send({ error: error.message });
	}
});

module.exports = router;
