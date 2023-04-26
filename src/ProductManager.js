const fs = require('fs').promises;

class ProductManager {
  constructor(namefile) {
    this.namefile = namefile;
    this.lastId = 0;
  }

  async init() {
    try {
      const fileContents = await fs.readFile(`src/${this.namefile}`, 'utf-8');
      const savedProducts = JSON.parse(fileContents);
      this.lastId = savedProducts.reduce((max, p) => Math.max(max, p.id), 0);
    } catch (err) {
      console.error(`Error loading ${this.namefile}:`, err);
      this.lastId = 0;
    }
  }

  async addProduct(product) {
    const products = await this.getProductsFromFile();
    if (products.some(p => p.code === product.code)) {
      throw new Error(`Product with code "${product.code}" already exists`);
    }

    //(products.length) ? console.log('next id: ', products[products.length - 1].id + 1) : console.log('next id: ', 0);
    const id =  products.length ? products[products.length - 1].id + 1 : 0;

    const newProduct = {
      ...product,
      id,
    };
    products.push(newProduct);
		console.log('Added product: ', newProduct.title);
    await this.writeProductsToFile(products);
    return newProduct;
  }

  async getProducts() {
    return this.getProductsFromFile('getProducts');
  }

  async getProductById(id) {
    const products = await this.getProductsFromFile();
    const product = products.find(p => p.id === id);
    if (!product) {
      console.error(`Product with ID "${id}" not found`);
    } else {
			//console.log('Product found: ', product.title);
		}
    return product;
  }

  async updateProduct(id, product) {
    const products = await this.getProductsFromFile();
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      throw new Error(`Product with ID "${id}" not found`);
    }
    const updatedProduct = {
      ...product,
      id,
    };
    products[productIndex] = updatedProduct;
    await this.writeProductsToFile(products);
    return updatedProduct;
  }

  async deleteProduct(id) {
    const products = await this.getProductsFromFile();
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      throw new Error(`Product with ID "${id}" not found`);
    }
    const deletedProduct = products.splice(productIndex, 1)[0];
    await this.writeProductsToFile(products);
    return deletedProduct;
  }

  async getProductsFromFile(type) {
    try {
      const fileContents = await fs.readFile(`src/${this.namefile}`, 'utf-8');
			//if (type === 'getProducts') console.log(fileContents);
      return JSON.parse(fileContents);
    } catch (err) {
      console.error(`Error loading ${this.namefile}:`, err);
      return [];
    }
  }

  async writeProductsToFile(products) {
    await fs.writeFile(`src/${this.namefile}`, JSON.stringify(products, null, 2));
  }
}


const dogMemeNFT = {
	title: 'Dog Meme NFT',
	description: 'Most expensive meme ever, but worth it',
	price: 9990,
	stock: 1,
	code: 555,
	thumbnail: 'https://media-cldnry.s-nbcnews.com/image/upload/t_nbcnews-fp-1024-512,f_auto,q_auto:best/rockcms/2022-01/210602-doge-meme-nft-mb-1715-8afb7e.jpg'
}

const cookie = {
	title: 'Cookie',
	description: 'Regular chocolate chip cookie',
	price: 1,
	stock: 1,
	code: 333,
	thumbnail: 'https://media.istockphoto.com/id/517109442/photo/chocolate-chip-cookie-isolated.jpg?s=612x612&w=0&k=20&c=RgZOYwzVRTXnIBy8zSkXK-wJfNBy9w023UGULkbH_VE='
}

const strawberry = {
  title: 'Strawberry',
  description: 'Fresh strawberry',
  price: 1,
  stock: 1,
  code: 444,
  thumbnail: 'https://www.gardeningknowhow.com/wp-content/uploads/2021/07/strawberry.jpg'
}

const car = {
  title: 'Car',
  description: 'A car',
  price: 100000,
  stock: 1,
  code: 666,
  thumbnail: 'https://cars.usnews.com/static/images/Auto/izmo/i159615234/2023_acura_integra_angularfront.jpg'
}

const guitar = {
  title: 'Guitar',
  description: 'A guitar',
  price: 200,
  stock: 1,
  code: 777,
  thumbnail: 'https://bienestarconfort.com.ar/wp-content/uploads/2022/10/guitarra-bamboo7-02638dec1c2871de8115865484794780-1024-1024.png'
}

const bottle = {
  title: 'Bottle',
  description: 'A bottle',
  price: 10,
  stock: 5,
  code: 888,
  thumbnail: 'https://sublitextil.com.ar/wp-content/uploads/2019/04/Botella-Deportiva-Sublimable.png'
}

const basketball = {
  title: 'Basketball',
  description: 'A basketball',
  price: 100,
  stock: 1,
  code: 999,
  thumbnail: 'https://productimages.biltema.com/v1/Image/product/xlarge/2000046014/2'
}

const iphone = {
  title: 'iPhone',
  description: 'Overrated phone',
  price: 1400,
  stock: 1,
  code: 400,
  thumbnail: 'https://www.iphonemodding.com/wp-content/uploads/2021/09/iphone-13-pro-max-1.jpg'
}

const secretProduct = {
  title: 'Secret Product',
  description: 'This product is a secret, could be anything',
  price: 1000000,
  stock: 1,
  code: 12345,
  thumbnail: 'https://cdn.shopify.com/s/files/1/0327/7763/3930/products/instagram_967d7f69-6556-4e1f-9c53-8009f5147d39.jpg?v=1634813414'
}

const privateJet = {
  title: 'Private Jet',
  description: 'Lets be honest, you will never buy this',
  price: 10000000,
  stock: 1,
  code: 54321,
  thumbnail: 'https://cdn.forbes.com.mx/2016/01/Phenom-100.jpg'
}

const messi = {
  title: 'Messi',
  description: 'The best player in the world, only 1 available',
  price: 100000000,
  stock: 1,
  code: 11111,
  thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Lionel-Messi-Argentina-2022-FIFA-World-Cup.jpg'
}

let productManager = new ProductManager("./products.json");

// Metodos para probar (probar uno a la vez y notar como se actualiza el archivo products.json)
//productManager.getProducts();
//productManager.addProduct(dogMemeNFT);
//productManager.addProduct(cookie);
//productManager.addProduct(strawberry);
//productManager.addProduct(car);
//productManager.addProduct(guitar);
//productManager.addProduct(bottle);
//productManager.addProduct(basketball);
//productManager.addProduct(iphone);
//productManager.addProduct(secretProduct);
//productManager.addProduct(privateJet);
//productManager.addProduct(messi);
//productManager.getProducts();
//productManager.getProductById(3);
//productManager.getProductById(1);
//productManager.updateProduct(1, {...dogMemeNFT, 'title': 'Cat Meme NFT', thumbnail: 'https://i.cbc.ca/1.5359228.1577206958!/fileImage/httpImage/image.jpg_gen/derivatives/16x9_940/smudge-the-viral-cat.jpg'});
//productManager.deleteProduct(1);

module.exports = productManager;
