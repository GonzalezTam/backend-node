const products = require('./src/products.json');
const express = require('express');
const app = express();

app.listen(3000, () => {
	console.log('Server is running on port 3000');
	//console.log(products)
});

app.get('/', (req, res) => {
	res.send('Home');
});

// Debe leer el archivo de productos y devolverlo dentro de un objeto.
// Agregar el soporte para recibir por query param el valor ?limit={number}
// Si se recibe el query param limit, devolver la cantidad de productos indicada por el valor del query param.
// Si no se recibe el query param limit, devolver todos los productos.
app.get('/products', (req, res) => {
	res.send({ products });
});
