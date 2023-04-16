const fs = require('fs').promises;

class CartManager {
  constructor(namefile) {
    this.namefile = namefile;
    this.lastId = 0;
  }

  async init() {
    try {
      const fileContents = await fs.readFile(this.namefile, 'utf-8');
      const savedCarts = JSON.parse(fileContents);
      this.lastId = savedCarts.reduce((max, p) => Math.max(max, p.id), 0);
    } catch (err) {
      console.error(`Error loading ${this.namefile}:`, err);
      this.lastId = 0;
    }
  }

  async getCarts() {
    return this.getCartsFromFile('getCarts');
  }

  async getCartById(id) {
    const carts = await this.getCartsFromFile();
    const cart = carts.find(c => c.id === id);
    if (!cart) {
      console.error(`Cart with ID "${id}" not found`);
    } else {
			console.log('Cart found: ', cart.title);
		}
    return cart;
  }

  async addCart(products) {
    const carts = await this.getCartsFromFile();
    const id =  carts.length ? carts[carts.length - 1].id + 1 : 0;
    const newCart = {
      id,
      products
    };
    carts.push(newCart);
		console.log('Added cart with id: ', newCart.id);
    await this.writeCartsToFile(carts);
    return newCart;
  }

async addProductToCart(cartId, productId, quantity) {
    const carts = await this.getCartsFromFile();
    const cartIndex = carts.findIndex(c => c.id === cartId);
    if (cartIndex === -1) {
      throw new Error(`Cart with ID "${cartId}" not found`);
    }
    const cart = carts[cartIndex];
    const productIndex = cart.products.findIndex(p => p.id === productId);
    if (productIndex === -1) {
      console.log(`Product with ID "${productId}" not found, adding it to cart`);
      cart.products.push({
        id: productId,
        quantity,
      });
    } else {
      const product = cart.products[productIndex];
      product.quantity += quantity;
    }

    await this.writeCartsToFile(carts);
    return cart;
  }

  //async updateCart(id, cart) {
  //  const carts = await this.getCartsFromFile();
  //  const cartIndex = carts.findIndex(c => c.id === id);
  //  if (cartIndex === -1) {
  //    throw new Error(`Cart with ID "${id}" not found`);
  //  }
  //  const updatedCart = {
  //    ...cart,
  //    id,
  //  };
  //  carts[cartIndex] = updatedCart;
  //  await this.writeCartsToFile(carts);
  //  return updatedCart;
  //}

  //async deleteCart(id) {
  //  const carts = await this.getCartsFromFile();
  //  const cartIndex = carts.findIndex(c => c.id === id);
  //  if (cartIndex === -1) {
  //    throw new Error(`Cart with ID "${id}" not found`);
  //  }
  //  const deletedCart = carts.splice(cartIndex, 1)[0];
  //  await this.writeCartsToFile(carts);
  //  return deletedCart;
  //}

  async getCartsFromFile(type) {
    try {
      const fileContents = await fs.readFile(this.namefile, 'utf-8');
			//if (type === 'getCarts') console.log(fileContents);
      return JSON.parse(fileContents);
    } catch (err) {
      console.error(`Error loading ${this.namefile}:`, err);
      return [];
    }
  }

  async writeCartsToFile(carts) {
    await fs.writeFile(this.namefile, JSON.stringify(carts, null, 2));
  }
}

let cartManager = new CartManager("./carts.json");

module.exports = cartManager;
