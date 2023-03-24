class ProductManager {
		#products = [];
		constructor() {
			this.#products = [];
		}

		#checkEntry(title, description, price, stock, code, thumbnail) {
			if (!title || !description || !price || !stock || !code || !thumbnail) return console.log('All fields are required');
			if (this.#products.find((product) => product.code === code)) return console.log(`Code ${code} already exists in products`); else return true;
		}
		#setAutoIncrementId() {
			let id;
			if (this.#products.length === 0) id = 1; else id = this.#products[this.#products.length-1].id + 1;
			return id;
		}
		addProduct(title, description, price, stock, code, thumbnail) {
			if (!this.#checkEntry(title, description, price, stock, code, thumbnail)) return false;
			let id = this.#setAutoIncrementId();
			const newProduct = {id, title, description, price, stock, code, thumbnail};
			this.#products = [...this.#products, newProduct]
			console.log(`"${newProduct.title}" added`);
			return this.products;
		}
		getProducts() {
			console.log(this.#products);
			return this.#products;
		}
		getProductById(id) {
			const product =	this.#products.find((product) => product.id === id);
			if (product) console.log(product); else return console.log('Not found');
			return product;
		}
}

let productManager = new ProductManager();
productManager.getProducts();

productManager.addProduct('Dog Meme NFT','Most expensive meme ever, but worth it', 9990, 1, 'asd-111',
	'https://media-cldnry.s-nbcnews.com/image/upload/t_nbcnews-fp-1024-512,f_auto,q_auto:best/rockcms/2022-01/210602-doge-meme-nft-mb-1715-8afb7e.jpg'
);

productManager.addProduct('Cookie','Regular chocolate chip cookie', 1, 1, 'fgh-222',
	'https://media.istockphoto.com/id/517109442/photo/chocolate-chip-cookie-isolated.jpg?s=612x612&w=0&k=20&c=RgZOYwzVRTXnIBy8zSkXK-wJfNBy9w023UGULkbH_VE='
);

productManager.getProducts();
productManager.getProductById(2);