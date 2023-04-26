let productsArray = [];
document.onreadystatechange = async () => {
	await fetch('http://localhost:8080/api/products')
		.then(res => res.json())
		.then(data => {
			//console.log('fetch', data);
			productsArray = data.products;
		})
		.catch(err => console.log(err))
}

let socket
let submit = document.getElementById('submit')
let removeProduct = document.getElementsByClassName('remove-product')
let title = document.getElementById('title');
let category = document.getElementById('category');
let description = document.getElementById('description');
let price = document.getElementById('price');
let stock = document.getElementById('stock');
let code = document.getElementById('code');
let gallery = document.getElementById('products-div')

document.addEventListener('click', function (e) {
  if (e.target.matches('.remove-product')) delete_product(e.target.dataset.id);
}, false);

socket = io();
socket.on('new_product', data => {
	//console.log('new_product:', data);
	productsArray[data.id] = data;
	let productsCards = '';
	productsArray.forEach(p => {
		productsCards += `
			<div class="card m-2 p-0" style="width: 16rem;">
				<img src="http://via.placeholder.com/640x360" class="card-img-top" alt="...">
				<div class="card-body">
					<h5 class="card-title">${p.title}</h5>
					<p class="card-text">${p.description}</p>
				</div>
				<ul class="list-group list-group-flush">
					<li class="list-group-item">Price: $${p.price}</li>
					<li class="list-group-item">Stock: ${p.stock}</li>
					<li class="list-group-item">ID: ${p.id}</li>
				</ul>
				<div class="card-footer text-right">
					<li class="list-group-item text-end"><button data-id="${p.id}" type="button" class="remove-product btn btn-danger btn-sm">Remove</button></li>
				</div>
			</div>
			`
	})
	gallery.innerHTML = '';
	gallery.innerHTML = productsCards;
})

socket.on('delete_product', data => {
	//console.log('delete_product:', data);
	let productsCards = '';
	productsArray = productsArray.filter(p => p.id !== data);
	productsArray.forEach(p => {
		productsCards += `
			<div class="card m-2 p-0" style="width: 16rem;">
				<img src="http://via.placeholder.com/640x360" class="card-img-top" alt="...">
				<div class="card-body">
					<h5 class="card-title">${p.title}</h5>
					<p class="card-text">${p.description}</p>
				</div>
				<ul class="list-group list-group-flush">
					<li class="list-group-item">Price: $${p.price}</li>
					<li class="list-group-item">Stock: ${p.stock}</li>
					<li class="list-group-item">ID: ${p.id}</li>
				</ul>
				<div class="card-footer text-right">
				<li class="list-group-item text-end"><button data-id="${p.id}" type="button" class="remove-product btn btn-danger btn-sm">Remove</button></li>
				</div>
			</div>
			`
	})
	gallery.innerHTML = '';
	gallery.innerHTML = productsCards;
	if (gallery.innerHTML === '') gallery.innerHTML = '<p class="m-1">No products available.</p>';
})

async function delete_product(id) {
	//console.log('removeProduct', id);
	try {
		const response = await fetch(`http://localhost:8080/api/products/${id}`, {
			method: 'delete',
		});
		if (response.status === 200) {
			const data = await response.json();
			socket = io();
			/* Envia producto respetando id unico, permite ademas,
				contar con todas las validaciones del endpoint.*/
			socket.emit('productDelete', data.deletedProduct)
		} else if (response.status === 400) {
			const data = await response.json();
			console.error(data.error);
		} else {
			throw new Error('Unexpected response');
		}
	} catch (err) {
		console.error(`Error: ${err}`);
	}
}

submit.addEventListener('click', async (e) => {
	e.preventDefault();
	//console.log('submit');
	try {
		const body = {
			title: title.value,
			category: category.value,
			description: description.value,
			price: parseInt(price.value),
			stock: parseInt(stock.value),
			code: code.value,
		}
		const response = await fetch('http://localhost:8080/api/products', {
			method: 'post',
			body: JSON.stringify(body),
			headers: { 'Content-Type': 'application/json' },
		});
		if (response.status === 200) {
			const data = await response.json();
			socket = io();
			/* Envia producto respetando id unico, permite ademas,
				contar con todas las validaciones del endpoint.*/
			socket.emit('productSubmit', data.newProduct)
		} else if (response.status === 400) {
			const data = await response.json();
			console.error(data.error);
		} else {
			throw new Error('Unexpected response');
		}
	} catch (err) {
		console.error(`Error: ${err}`);
	}
})
