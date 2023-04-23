const { Router } = require('express');
const cartManager = require('./../CartManager');

const router = Router();

router.get('/', async (req, res) => {
	const carts = await cartManager.getCarts();
	res.send({ carts });
});

router.get('/:cid', async (req, res) => {
	const id = +req.params.cid;
	const cart = await cartManager.getCartById(id);
	if (cart) {
		res.send({ cart });
	} else {
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
	const cart = await cartManager.addCart(products);
	res.send({ cart });
});

router.post('/:cid/product/:pid', async (req, res) => {
	const cartId = +req.params.cid;
	const productId = +req.params.pid;
	const quantity = 1;
	if (!cartId) {
		res.status(400).send({ error: 'No Cart ID provided' });
		return;
	}
	if (!productId) {
		res.status(400).send({ error: 'No Product ID provided' });
		return;
	}
	const cart = await cartManager.addProductToCart(cartId, productId, quantity);
	res.send({ cart });
});

module.exports = router;
