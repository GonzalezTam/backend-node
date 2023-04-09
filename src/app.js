const express = require('express');
const app = express();
const productManager = require('./ProductManager');

app.listen(8080, () => {
	console.log('Server is running on port 8080');
});

app.get('/', (req, res) => {
	res.send('Home');
});

app.get('/products', async (req, res) => {
	const products = await productManager.getProducts();
	const limit = req.query.limit;
	if (limit) {
		const productsLimit = products.slice(0, limit);
		res.send({ products: productsLimit });
	} else {
		res.send({ products });
	}
});

app.get('/products/:id', async (req, res) => {
	const id = +req.params.id;
	const product = await productManager.getProductById(id);
	if (product) {
		res.send({ product });
	} else {
		res.status(404).send({ 'Product not found' : id });
	}
});