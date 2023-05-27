const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const express = require('express');
const session = require('express-session')
const MongoStore = require('connect-mongo');

const handlebars = require('express-handlebars');
const { Server } = require('socket.io');
const viewsRouter = require('./routes/views.router.js');
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const sessionRouter = require('./routes/session.router.js');

async function connectDB() {
  try{
    await mongoose.connect("mongodb+srv://coder:coder@backend39755.igyxgug.mongodb.net/ecommerce", {
      serverSelectionTimeoutMS: 5000
    })
    console.log("DB Connected")
  } catch (error) {
    console.log("DB Connection Error")
  }
}

const app = express();
mongoose.set('strict', false);

try {
  connectDB();
  const httpServer = app.listen(8080, () => console.log('Server is running on port 8080'));

  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json())

  app.use(session({
    store: MongoStore.create({
      mongoUrl: 'mongodb+srv://coder:coder@backend39755.igyxgug.mongodb.net/',
      dbName: 'ecommerce-sessions',
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    }),
    secret: 'jamesbond',
    resave: true,
    saveUninitialized: true
}))

  app.engine('handlebars', handlebars.engine())
  app.set('views', './src/views')
  app.set('view engine', 'handlebars')
  app.use(express.static('./src/public'))
  app.use('/api/products', productsRouter);
  app.use('/api/carts', cartsRouter);
  app.use('/api/session', sessionRouter);
  app.use('/', viewsRouter)

  const socketServer = new Server(httpServer, { port: 8081 });

  socketServer.on('connection', (socketClient) => {
    socketClient.on('productSubmit', (data) => {
      const p = data;
      socketServer.emit('new_product', p);
    })
    socketClient.on('productDelete', (data) => {
      const pid = data._id;
      socketServer.emit('delete_product', pid);
    })
    socketClient.on('cartCreated', (data) => {
      const cart = data;
      socketServer.emit('cartCreated', cart);
    })
    socketClient.on('cartUpdated', (data) => {
      const cart = data;
      socketServer.emit('cartUpdated', cart);
    })
  })
} catch (error) {
  console.log("Server Error")
}
