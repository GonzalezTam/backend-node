const express = require('express');
const app = express();
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => { res.send('Home'); });
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);


app.listen(8080, () => console.log('Server is running on port 8080'));
